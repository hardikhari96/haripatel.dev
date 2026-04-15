# Project Context — haripatel.dev

> This file provides AI assistants and contributors with a quick understanding of the codebase, architecture, and conventions.

## Overview

Personal portfolio website for **Harikrushna Patel** — Full Stack Developer. Built with Astro, deployed on Vercel, featuring an AI chatbot powered by RAG (Retrieval-Augmented Generation) with Upstash Vector DB and NVIDIA LLM API.

**Live URL**: https://haripatel.dev  
**Repo**: `hardikhari96/haripatel.dev`  
**Default branch**: `astro_project`  
**Dev branch**: `astro_cli_theme`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro v5.x (SSR mode, `output: 'server'`) |
| Adapter | `@astrojs/vercel` — serverless deployment on Vercel |
| LLM | NVIDIA API (`meta/llama-3.1-8b-instruct`) via OpenAI SDK |
| Vector DB | Upstash Vector (BGE_LARGE_EN_V1_5 embeddings, COSINE, HYBRID) |
| Styling | Vanilla CSS with `<style is:global>` for dynamic elements |
| Content | Astro Content Collections (Markdown) |

---

## Directory Structure

```
src/
├── components/
│   ├── ChatBot.astro         # AI chatbot widget (floating, fullscreen, streaming, markdown)
│   ├── ThemeToggle.astro      # Season/festival toggle (currently HIDDEN on all pages)
│   ├── FestiveDecoration.astro
│   ├── SeasonDecoration.astro
│   ├── SnowEffect.astro / RainEffect.astro / LeafEffect.astro
│
├── content/
│   ├── config.ts              # Content collection schema (projects)
│   └── projects/              # 13 project markdown files
│
├── data/
│   ├── profile.json           # Personal info, experience, education, certificates, skills
│   ├── projects.json          # Additional projects (currently empty — all projects in content/)
│   └── theme.json             # Festival/season theme config
│
├── lib/
│   ├── kv.ts                  # Upstash Vector client (upsert, query, reset, isSeeded)
│   ├── hashnode.ts            # Blog posts from Hashnode API
│   └── theme.ts               # Theme/season detection logic
│
├── pages/
│   ├── index.astro            # Home page
│   ├── blog/index.astro       # Blog listing (Hashnode)
│   ├── projects/
│   │   ├── index.astro        # Project gallery (grouped: personal / company)
│   │   └── [slug].astro       # Individual project detail page
│   └── api/
│       ├── chat.ts            # POST: streaming SSE chat with RAG context
│       └── seed.ts            # POST: seed vector DB | GET: check if seeded
│
├── styles/
│   └── global.css             # Global styles
```

---

## Key Files & How They Work

### ChatBot (`src/components/ChatBot.astro`)
- Floating widget rendered on **all pages** (index, blog, projects, project detail)
- Streaming SSE consumer — reads `data:` events from `/api/chat`
- Custom markdown renderer (code blocks, tables, headings, bold, italic, lists, links)
- All links open in `target="_blank"`
- **State persistence**: `sessionStorage` stores conversation history + open/fullscreen state across page navigations
- Styled with `<style is:global>` because `<script>` dynamically creates DOM elements

### Chat API (`src/pages/api/chat.ts`)
- Accepts `{ messages: Array<{role, content}> }`
- Queries Upstash Vector for top 10 relevant documents using the last user message
- Builds system prompt with RAG context (profile, projects with `/projects/{slug}` links)
- Falls back to `buildLocalContext()` if vector DB is unavailable
- Streams response via SSE (`data: {content}` chunks, `data: [DONE]` terminator)

### Seed API (`src/pages/api/seed.ts`)
- `POST /api/seed` — seeds vector DB with profile + 13 content projects = 14 documents
- `POST /api/seed?reset=true` — clears index first, then re-seeds
- `GET /api/seed` — returns `{ seeded: true/false }`
- Profile text includes: about, skills, experience, education, certificates, all contact links

### Vector DB (`src/lib/kv.ts`)
- Upstash Vector with built-in BGE_LARGE_EN_V1_5 embeddings
- Pass `data` (text) not raw vectors — embeddings are computed server-side
- `VectorDoc` interface: `{ id, data, metadata }` where metadata has type, title, slug, year, tags, etc.

---

## Data Sources

### profile.json
- Owner info: name, tagline, email, GitHub, LinkedIn, Twitter, Medium, blog, CV
- Experience: 3 companies (Credify Technologies Pvt Ltd, Aarya Infoline, Denim Softwares Pvt Ltd)
- Education: BSc Physics, Sardar Patel University (2017-2019)
- Certificates: Software Development (2020), Neo4j Cypher (2023)
- Skills: languages, frontend, devops, cloud, backend, databases, tools

### Content Projects (src/content/projects/)
13 markdown files with frontmatter schema:
- `title`, `description`, `year`, `tags[]`, `category` (personal/company), `company?`, `github?`, `link?`, `subcategory?`

### projects.json
- Currently empty (`personal: [], company: []`). All projects live in content collection.
- Was previously used for additional projects but fake placeholder data was removed.

---

## Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `NVIDIA_API_KEY` | NVIDIA API key for LLM (meta/llama-3.1-8b-instruct) |
| `UPSTASH_VECTOR_REST_URL` | Upstash Vector DB endpoint |
| `UPSTASH_VECTOR_REST_TOKEN` | Upstash Vector read/write token |
| `UPSTASH_VECTOR_REST_READONLY_TOKEN` | Upstash Vector read-only token |

---

## Build & Deploy

```bash
npm run dev          # Local dev server (port 4321)
npm run build        # Production build (outputs to .vercel/)
npx astro preview    # Preview production build locally
```

Deploy: Push to `astro_cli_theme` branch → Vercel auto-deploys.

After profile/project data changes, re-seed the vector DB:
```bash
curl -X POST "https://haripatel.dev/api/seed?reset=true"
# or locally:
curl -X POST "http://localhost:4321/api/seed?reset=true"
```

---

## Conventions & Notes

- **ThemeToggle** is commented out (`<!-- <ThemeToggle /> -->`) on all pages — disabled for now
- **ChatBot** uses `is:global` styles because script-generated DOM doesn't get Astro scoped attributes
- **Links in chatbot** always open in new tab (`_blank`)
- **Content collection** is the single source of truth for projects (not `projects.json`)
- **No session/user auth** — chatbot is stateless server-side; client-side state via `sessionStorage`
- **Markdown in chatbot**: custom renderer handles code blocks, tables, headings, bold/italic, lists (only `-` for unordered), links, blockquotes
