import { Index } from '@upstash/vector';

let index: Index | null = null;

export function getIndex(): Index {
  if (!index) {
    const url = import.meta.env.UPSTASH_VECTOR_REST_URL;
    const token = import.meta.env.UPSTASH_VECTOR_REST_TOKEN;
    if (!url || !token) {
      throw new Error('UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN are required');
    }
    index = new Index({ url, token });
  }
  return index;
}

// ===== Types =====
export interface VectorDoc {
  id: string;
  data: string;           // The text content used for embedding
  metadata: {
    type: 'profile' | 'project' | 'projects_data';
    title?: string;
    slug?: string;
    year?: string;
    tags?: string;
    category?: string;
    company?: string;
    github?: string;
    description?: string;
    email?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    medium?: string;
    blog?: string;
    cv?: string;
    [key: string]: unknown;
  };
}

// ===== Upsert documents =====
export async function upsertDocuments(docs: VectorDoc[]) {
  const idx = getIndex();
  // Upstash Vector with built-in embedding: pass `data` (text) instead of `vector`
  const vectors = docs.map((doc) => ({
    id: doc.id,
    data: doc.data,
    metadata: doc.metadata,
  }));
  // Upsert in batches of 10
  for (let i = 0; i < vectors.length; i += 10) {
    await idx.upsert(vectors.slice(i, i + 10));
  }
}

// ===== Query by similarity =====
export async function queryRelevant(
  query: string,
  topK: number = 8,
  filter?: string
): Promise<Array<{ id: string; score: number; metadata: VectorDoc['metadata'] }>> {
  const idx = getIndex();
  const results = await idx.query({
    data: query,
    topK,
    includeMetadata: true,
    ...(filter ? { filter } : {}),
  });
  return results.map((r) => ({
    id: r.id as string,
    score: r.score,
    metadata: (r.metadata || {}) as VectorDoc['metadata'],
  }));
}

// ===== Fetch all documents of a type =====
export async function fetchByType(
  type: 'profile' | 'project' | 'projects_data'
): Promise<Array<{ id: string; metadata: VectorDoc['metadata'] }>> {
  const idx = getIndex();
  const results = await idx.query({
    data: type === 'profile' ? 'profile information about Harikrushna Patel' :
          type === 'project' ? 'software development projects' :
          'additional projects data',
    topK: 50,
    includeMetadata: true,
    filter: `type = '${type}'`,
  });
  return results.map((r) => ({
    id: r.id as string,
    metadata: (r.metadata || {}) as VectorDoc['metadata'],
  }));
}

// ===== Check if data is seeded =====
export async function isSeeded(): Promise<boolean> {
  const idx = getIndex();
  const info = await idx.info();
  return (info.vectorCount ?? 0) > 0;
}

// ===== Reset index =====
export async function resetIndex() {
  const idx = getIndex();
  await idx.reset();
}
