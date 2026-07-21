import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { queryRelevant, isSeeded } from '../../lib/kv';
import {
  validateChatMessages,
  accumulateToolCallDelta,
  TOOL_DEFINITIONS,
  TOOLS_SYSTEM_PROMPT,
  type ToolCall,
} from '../../lib/chat-tools';

function buildSystemPrompt(context: string) {
  return `You are a helpful assistant on Harikrushna Patel's personal website. Your job is to answer questions about Harikrushna's profile, skills, experience, and projects in a friendly and concise way.

IMPORTANT: When mentioning any project, page, or resource, ALWAYS include the relevant link in markdown format like [Project Name](/projects/slug) so the user can click through. When mentioning the blog, link to [Blog](/blog). When mentioning the projects page, link to [Projects](/projects).

Here is relevant information retrieved from the knowledge base:
${context}

Site pages:
- Home: /
- Projects: /projects
- Blog: /blog

Keep your responses brief and relevant. Always include clickable markdown links when referring to projects or pages. If someone asks something unrelated to Harikrushna's profile, politely redirect them to ask about his skills, experience, or projects.
If the retrieved context doesn't contain enough information to answer, say so honestly rather than making things up.${TOOLS_SYSTEM_PROMPT}`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const userMessages = body.messages;
  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Messages array is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validatedMessages = validateChatMessages(userMessages);

  if (validatedMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'At least one valid message is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get the latest user message for vector search
  const lastUser = [...validatedMessages].reverse().find((m) => m.role === 'user');
  const lastUserMsg = lastUser?.content ?? '';

  // Build context via vector similarity search or fallback to local data
  let context: string;

  try {
    const seeded = await isSeeded();
    if (seeded) {
      // RAG: query vector DB for relevant documents
      const results = await queryRelevant(lastUserMsg, 10);
      context = results
        .map((r) => {
          const m = r.metadata;
          if (m.type === 'profile') {
            const links = [
              m.email ? `Email: ${m.email}` : '',
              m.website ? `Website: ${m.website}` : '',
              m.github ? `GitHub: ${m.github}` : '',
              m.linkedin ? `LinkedIn: ${m.linkedin}` : '',
              m.twitter ? `Twitter: ${m.twitter}` : '',
              m.medium ? `Medium: ${m.medium}` : '',
              m.blog ? `Blog: ${m.blog}` : '',
              m.cv ? `CV/Resume: ${m.cv}` : '',
            ].filter(Boolean).join('. ');
            return `[Profile] ${m.title}: ${m.description}. ${links}`;
          } else if (m.type === 'project') {
            const link = m.slug ? `/projects/${m.slug}` : '';
            const tags = m.tags ? ` | Tags: ${m.tags}` : '';
            const company = m.company ? ` at ${m.company}` : '';
            const github = m.github ? ` | GitHub: ${m.github}` : '';
            return `[Project] [${m.title}](${link}) (${m.year || 'N/A'}${company}): ${m.description}${tags}${github}`;
          } else {
            const company = m.company ? ` at ${m.company}` : '';
            const link = m.github ? ` | Link: ${m.github}` : '';
            return `[Additional] ${m.title} (${m.year || 'N/A'}${company}): ${m.description}${link}`;
          }
        })
        .join('\n');
    } else {
      // Fallback: load local data if vector DB not seeded
      context = await buildLocalContext();
    }
  } catch {
    // If vector DB fails, fall back to local data
    context = await buildLocalContext();
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    timeout: 30000,
    maxRetries: 3,
    defaultHeaders: {
      'HTTP-Referer': 'https://haripatel.dev',
      'X-Title': "Hari's AI Assistant",
    },
  });

  const systemPrompt = buildSystemPrompt(context);

  try {
    const stream = await openai.chat.completions.create({
      model: import.meta.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        ...validatedMessages,
      ] as Parameters<typeof openai.chat.completions.create>[0]['messages'],
      tools: TOOL_DEFINITIONS,
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const toolCalls: ToolCall[] = [];
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;
            if (delta?.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`));
            }
            if (delta?.tool_calls) {
              accumulateToolCallDelta(toolCalls, delta.tool_calls as unknown[]);
            }
          }
          if (toolCalls.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tool_calls: toolCalls })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Fallback: build context from local files when vector DB is unavailable
async function buildLocalContext(): Promise<string> {
  const profileMod = await import('../../data/profile.json');
  const projectsDataMod = await import('../../data/projects.json');
  const { getCollection } = await import('astro:content');
  const profile = profileMod.default;
  const projectsData = projectsDataMod.default;
  const projects = await getCollection('projects');

  const lines: string[] = [];

  lines.push(`[Profile] ${profile.name} - ${profile.tagline}. ${profile.about.join(' ')}`);
  lines.push(`Skills: Languages: ${profile.skills.languages.join(', ')}. DevOps: ${profile.skills.devops.join(', ')}. Cloud: ${profile.skills.cloud.join(', ')}. Backend: ${profile.skills.backend.join(', ')}. Databases: ${profile.skills.databases.join(', ')}. Tools: ${profile.skills.tools.join(', ')}.`);
  lines.push(`Experience: ${profile.experience.map((e: { position: string; company: string; period: string; description: string }) => `${e.position} at ${e.company} (${e.period}): ${e.description}`).join('. ')}`);
  lines.push(`Website: ${profile.website}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}. Blog: ${profile.blog}.`);

  for (const p of projects) {
    const d = p.data;
    const slug = p.id.replace(/\.md$/, '');
    const tags = d.tags ? d.tags.join(', ') : '';
    const company = d.company ? ` at ${d.company}` : '';
    const github = d.github ? ` | GitHub: ${d.github}` : '';
    lines.push(`[Project] [${d.title}](/projects/${slug}) (${d.year || 'N/A'}${company}): ${d.description} | Tags: ${tags}${github}`);
  }

  for (const p of projectsData.personal) {
    lines.push(`[Additional] ${p.title} (${p.year}): ${p.description}`);
  }
  for (const p of projectsData.company) {
    lines.push(`[Additional] ${p.title} at ${p.company} (${p.year}): ${p.description}`);
  }

  return lines.join('\n');
}
