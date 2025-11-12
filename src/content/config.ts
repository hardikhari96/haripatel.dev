import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number().optional(),
    tags: z.array(z.string()).optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    category: z.enum(['personal', 'company']).optional(),
    subcategory: z.enum(['ai', 'backend', 'frontend', 'infrastructure', 'other']).optional(),
    company: z.string().optional(),
  }),
});

export const collections = { blog, projects };
