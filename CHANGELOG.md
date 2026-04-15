# Changelog — haripatel.dev

All notable changes to this project are documented in this file.

---

## [2026-04-15] — AI Chatbot, RAG, Data Accuracy Overhaul

### Added
- **AI Chatbot** (`src/components/ChatBot.astro`)
  - Floating widget with streaming SSE responses
  - Custom markdown renderer (code blocks, tables, headings, bold/italic, lists, links, blockquotes)
  - Fullscreen mode toggle
  - All links open in new tab (`_blank`)
  - Conversation state persistence via `sessionStorage` — history and UI state survive page navigation
  - Rendered on all pages: home, blog, projects list, project detail

- **RAG with Upstash Vector** (`src/lib/kv.ts`)
  - Replaced previous Upstash Redis/KV setup with Vector DB for semantic search
  - BGE_LARGE_EN_V1_5 embeddings, COSINE similarity, HYBRID index
  - Singleton client pattern with helper functions: `upsertDocuments`, `queryRelevant`, `resetIndex`, `isSeeded`

- **Chat API** (`src/pages/api/chat.ts`)
  - Streaming SSE endpoint with RAG context
  - Queries top 10 relevant vectors per user message
  - Builds rich context with profile links, project links (`/projects/{slug}`), tags, companies
  - Local fallback context if vector DB unavailable

- **Seed API** (`src/pages/api/seed.ts`)
  - Seeds 14 documents: 1 profile + 13 content collection projects
  - Profile text includes experience, education, certificates, all social/contact links
  - Supports `?reset=true` to clear and re-seed

- **Education & Certificates** added to `profile.json`
  - BSc Physics, Sardar Patel University (2017-2019)
  - Software Development and Application, Information Technology Centre (2020)
  - Neo4j Cypher Fundamentals, neo4j | Graph Academy (2023)

- **CONTEXT.md** — project architecture and conventions reference for AI assistants
- **CHANGELOG.md** — this file

### Changed
- **Astro adapter**: Migrated from `@astrojs/node` to `@astrojs/vercel` for Vercel deployment
- **Astro config**: Set `output: 'server'` for SSR (required by API endpoints)

### Fixed
- **Profile experience** — corrected to match CV:
  - Credify Technologies Pvt Ltd: position → Sr. Full Stack Developer, period → 2022 - Present
  - Aarya Infoline: period → 2020 - 2022
  - Denim Softwares Pvt Ltd: position → Developer, period → 2019 - 2020
- **Company names** in content projects (`credify-fintech.md`, `koinex-trading-platform.md`) matched to registered names
- **Project years** for Aarya Infoline projects: 2024 → 2021 (within actual tenure)
- **Skills** updated to include all CV skills: added HTML, CSS, PHP, Angular, Responsive Design, Apache, GitLab, Bitbucket, DigitalOcean, Oracle Cloud, OAuth, JWT, Elastic Search, SQL, NoSQL, WordPress, Bootstrap; added new `frontend` category
- **Fake projects removed** from `projects.json`: "Project Alpha", "CLI Tool", "Static Site Generator" (had placeholder `yourusername` links), and "Enterprise Dashboard" (TechCorp), "API Gateway" (StartupXYZ) — non-existent companies

### Removed
- **ThemeToggle** — commented out on all pages (was visible on blog, projects, project detail)
- **Session API** (`src/pages/api/session.ts`) — deleted (was for Redis session cleanup, no longer needed)
- **Fake placeholder data** from `projects.json` — both personal and company arrays now empty; all real projects are in content collection

---

## [Pre-2026-04-15] — Initial Portfolio

- Astro-based personal portfolio with project gallery, blog (Hashnode), and seasonal theme effects
- Content collection for project markdown files
- Festival/season decoration components (snow, rain, leaves)
