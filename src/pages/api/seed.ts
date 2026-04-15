import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import profile from '../../data/profile.json';
import projectsData from '../../data/projects.json';
import { upsertDocuments, isSeeded, resetIndex } from '../../lib/kv';
import type { VectorDoc } from '../../lib/kv';

export const POST: APIRoute = async ({ request }) => {
  // Optional: protect with a secret
  const authHeader = request.headers.get('authorization');
  const seedSecret = import.meta.env.SEED_SECRET;
  if (seedSecret && authHeader !== `Bearer ${seedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check if force re-seed
    const url = new URL(request.url);
    if (url.searchParams.get('reset') === 'true') {
      await resetIndex();
      // Wait for reset to propagate
      await new Promise((r) => setTimeout(r, 1000));
    }

    const docs: VectorDoc[] = [];

    // 1. Profile document
    const educationText = (profile as any).education ? (profile as any).education.map((e: any) => `${e.degree} from ${e.institution} (${e.period})`).join('. ') : '';
    const certificatesText = (profile as any).certificates ? (profile as any).certificates.map((c: any) => `${c.name} from ${c.issuer} (${c.year})`).join('. ') : '';
    const profileText = `Harikrushna Patel - ${profile.tagline}. ${profile.about.join(' ')} Skills: Languages: ${profile.skills.languages.join(', ')}. DevOps: ${profile.skills.devops.join(', ')}. Cloud: ${profile.skills.cloud.join(', ')}. Backend: ${profile.skills.backend.join(', ')}. Databases: ${profile.skills.databases.join(', ')}. Tools: ${profile.skills.tools.join(', ')}. Experience: ${profile.experience.map((e) => `${e.position} at ${e.company} (${e.period}): ${e.description}`).join('. ')}.${educationText ? ` Education: ${educationText}.` : ''}${certificatesText ? ` Certificates: ${certificatesText}.` : ''} Email: ${profile.email}. Website: ${profile.website}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}. Twitter: ${profile.twitter}. Medium: ${profile.medium}. Blog: ${profile.blog}. CV/Resume: ${profile.cv}.`;

    docs.push({
      id: 'profile',
      data: profileText,
      metadata: {
        type: 'profile',
        title: profile.name,
        description: profile.tagline,
        email: profile.email,
        website: profile.website,
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        medium: profile.medium,
        blog: profile.blog,
        cv: profile.cv,
      },
    });

    // 2. Content collection projects — one doc per project
    const projects = await getCollection('projects');
    for (const p of projects) {
      const d = p.data;
      const slug = p.id.replace(/\.md$/, '');
      const tags = d.tags ? d.tags.join(', ') : '';
      const projectText = `${d.title}: ${d.description}. Category: ${d.category || 'N/A'}. Year: ${d.year || 'N/A'}. Tags: ${tags}. ${d.company ? `Company: ${d.company}.` : ''} ${d.github ? `GitHub: ${d.github}` : ''}`;

      docs.push({
        id: `project:${slug}`,
        data: projectText,
        metadata: {
          type: 'project',
          title: d.title,
          slug,
          description: d.description,
          year: d.year ? String(d.year) : undefined,
          tags,
          category: d.category || undefined,
          company: d.company || undefined,
          github: d.github || undefined,
        },
      });
    }

    // 3. Additional projects from projects.json
    for (const p of projectsData.personal) {
      const link = p.link || '';
      docs.push({
        id: `projdata:personal:${p.title.toLowerCase().replace(/\s+/g, '-')}`,
        data: `${p.title} (${p.year}): ${p.description}. Personal project.${link ? ` Link: ${link}` : ''}`,
        metadata: {
          type: 'projects_data',
          title: p.title,
          description: p.description,
          year: p.year,
          category: 'personal',
          github: link || undefined,
        },
      });
    }
    for (const p of projectsData.company) {
      const link = p.link || '';
      docs.push({
        id: `projdata:company:${p.title.toLowerCase().replace(/\s+/g, '-')}`,
        data: `${p.title} at ${p.company} (${p.year}): ${p.description}. Company project.${link ? ` Link: ${link}` : ''}`,
        metadata: {
          type: 'projects_data',
          title: p.title,
          description: p.description,
          year: p.year,
          company: p.company,
          category: 'company',
          github: link || undefined,
        },
      });
    }

    await upsertDocuments(docs);

    return new Response(
      JSON.stringify({ ok: true, documents: docs.length }),
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

// GET: check if data is seeded
export const GET: APIRoute = async () => {
  try {
    const seeded = await isSeeded();
    return new Response(
      JSON.stringify({ seeded }),
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
