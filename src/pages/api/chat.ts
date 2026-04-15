import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import profile from '../../data/profile.json';

const systemPrompt = `You are a helpful assistant on Harikrushna Patel's personal website. Your job is to answer questions about Harikrushna's profile, skills, and experience in a friendly and concise way.

Here is Harikrushna's profile information:
- Name: ${profile.name}
- Tagline: ${profile.tagline}
- About: ${profile.about.join(' ')}
- Skills:
  - Languages: ${profile.skills.languages.join(', ')}
  - DevOps: ${profile.skills.devops.join(', ')}
  - Cloud: ${profile.skills.cloud.join(', ')}
  - Backend: ${profile.skills.backend.join(', ')}
  - Databases: ${profile.skills.databases.join(', ')}
  - Tools: ${profile.skills.tools.join(', ')}
- Experience:
${profile.experience.map((exp) => `  - ${exp.position} at ${exp.company} (${exp.period}): ${exp.description}`).join('\n')}
- Website: ${profile.website}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}
- Blog: ${profile.blog}

Keep your responses brief and relevant. If someone asks something unrelated to Harikrushna's profile, politely redirect them to ask about his skills, experience, or projects.`;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'NVIDIA_API_KEY is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages?: Array<{ role: string; content: string }> };
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

  const allowedRoles = new Set(['user', 'assistant']);
  const validatedMessages = userMessages
    .filter(
      (msg): msg is { role: string; content: string } =>
        typeof msg === 'object' &&
        msg !== null &&
        typeof msg.role === 'string' &&
        allowedRoles.has(msg.role) &&
        typeof msg.content === 'string'
    )
    .map((msg) => ({ role: msg.role, content: msg.content }));

  if (validatedMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'At least one valid message is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'minimaxai/minimax-m2.7',
      messages: [
        { role: 'system', content: systemPrompt },
        ...validatedMessages,
      ],
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? '';
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
