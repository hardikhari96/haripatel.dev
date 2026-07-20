# Modern Redesign + Chatbot Browser Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign haripatel.dev into a modern dark-first portfolio and give the AI chatbot five client-side browser tools (public IP+geo, device, network, geolocation, battery) via an OpenAI-style tool-call loop.

**Architecture:** A new shared `Layout.astro` + rewritten `global.css` (CSS custom properties, dark default, `[data-theme="light"]` overrides) replace the per-page boilerplate. Tool calling: `chat.ts` passes tool definitions to NVIDIA's API, accumulates streamed `tool_calls` deltas, and emits them as one SSE event; `ChatBot.astro` executes the tools in the browser and re-POSTs with `role:"tool"` results (max 5 rounds). Pure server logic lives in `src/lib/chat-tools.ts`, unit-tested with vitest.

**Tech Stack:** Astro 5 (SSR mode, prerendered pages), vanilla CSS, OpenAI SDK → NVIDIA API (`meta/llama-3.3-70b-instruct`), vitest (dev-only).

## Global Constraints

- Branch: all work on `redesign-browser-tools` (already created; spec committed).
- Spec: `docs/superpowers/specs/2026-07-20-modern-redesign-browser-tools-design.md`.
- No new runtime dependencies. vitest is allowed as a devDependency only.
- Keep `export const prerender = true;` on all four pages.
- Model: `meta/llama-3.3-70b-instruct` (was `meta/llama-3.1-8b-instruct`).
- Max 5 tool rounds per user turn client-side.
- Tool content length cap server-side: 4000 chars.
- RAG/vector code (`src/lib/kv.ts`), `seed.ts`, `hashnode.ts`, project markdown: DO NOT modify.
- Festival/season components (`SnowEffect`, `RainEffect`, `LeafEffect`, `FestiveDecoration`, `SeasonDecoration`, `ThemeToggle`): remove their imports/usages from pages, but do NOT delete the files.
- Favicon path is `/favicon.png` (existing pages use a broken `/fevicon.png` — fix while migrating).
- Umami analytics script tag must be kept on every page (it moves into Layout).
- Respect `prefers-reduced-motion` for all animations.
- Verify with `npm run build` after every task (repo has no test runner except the vitest tests added in Task 4).
- Commit after every task with the trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Design system, shared Layout, Home page

**Files:**
- Rewrite: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Rewrite: `src/pages/index.astro`
- Modify: `src/data/profile.json` (set `"showSkills": true`)

**Interfaces:**
- Produces: `Layout.astro` with props `{ title: string; description: string; active?: 'home' | 'projects' | 'blog' | 'none' }`, a `<slot />` for page content, and global CSS classes used by later tasks: `.section-title`, `.card`, `.card-grid`, `.chip`, `.chip-row`, `.btn`, `.btn-primary`, `.btn-ghost`, `.reveal`, `.prose`, `.filter-btn`, `.tagline-muted`. Tasks 2–3 migrate their pages onto exactly these.
- Consumes: existing `ChatBot.astro` (rendered inside Layout).

- [ ] **Step 1: Rewrite `src/styles/global.css`**

Replace the entire file with:

```css
/* Modern dark-first design system for haripatel.dev */

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #0a0d14;
  --bg-elevated: #11151f;
  --surface: rgba(255, 255, 255, 0.03);
  --surface-hover: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.09);
  --text: #e6e9f0;
  --text-muted: #9aa3b5;
  --accent: #6366f1;
  --accent-2: #22d3ee;
  --gradient: linear-gradient(135deg, #818cf8, #22d3ee);
  --glow: 0 0 40px rgba(99, 102, 241, 0.25);
  --shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  --radius: 14px;
}

[data-theme="light"] {
  --bg: #f8fafc;
  --bg-elevated: #ffffff;
  --surface: rgba(15, 23, 42, 0.03);
  --surface-hover: rgba(15, 23, 42, 0.06);
  --border: rgba(15, 23, 42, 0.12);
  --text: #0f172a;
  --text-muted: #55617a;
  --gradient: linear-gradient(135deg, #4f46e5, #0891b2);
  --glow: 0 0 40px rgba(79, 70, 229, 0.15);
  --shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
}

html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 60% 40% at 70% -10%, rgba(99, 102, 241, 0.12), transparent),
    radial-gradient(ellipse 50% 35% at 10% 10%, rgba(34, 211, 238, 0.07), transparent),
    var(--bg);
  transition: background 0.3s, color 0.3s;
}

.container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

a { color: var(--accent-2); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }

h1, h2, h3 { font-weight: 700; line-height: 1.25; }
p { margin-bottom: 1rem; }
ul { list-style: none; }
img { max-width: 100%; }

/* ===== Header / Nav ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--bg) 75%, transparent);
  border-bottom: 1px solid var(--border);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.brand {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text);
  letter-spacing: -0.02em;
}
.brand:hover { text-decoration: none; }
.brand-accent {
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links { display: flex; align-items: center; gap: 1.4rem; }
.nav-links a {
  color: var(--text-muted);
  font-size: 0.92rem;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active { color: var(--text); text-decoration: none; }

.theme-toggle {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.theme-toggle:hover { background: var(--surface-hover); }
.theme-icon-sun { display: none; }
.theme-icon-moon { display: inline; }
[data-theme="light"] .theme-icon-sun { display: inline; }
[data-theme="light"] .theme-icon-moon { display: none; }

/* ===== Hero ===== */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 5.5rem 0 4rem;
}
.hero-eyebrow { color: var(--accent-2); font-size: 1rem; margin-bottom: 0.4rem; }
.hero-name {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  letter-spacing: -0.03em;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.6rem;
}
.hero-tagline { color: var(--text-muted); font-size: 1.15rem; margin-bottom: 1.8rem; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-photo {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  border: 2px solid var(--border);
  box-shadow: var(--glow);
  flex-shrink: 0;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  font-family: inherit;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}
.btn:hover { text-decoration: none; transform: translateY(-1px); }
.btn-primary {
  background: var(--gradient);
  color: #fff;
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
}
.btn-ghost {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}
.btn-ghost:hover { background: var(--surface-hover); }

/* ===== Sections ===== */
.section { padding: 2.6rem 0; }
.section-title {
  font-size: 1.45rem;
  margin-bottom: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.section-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
}
.tagline-muted { color: var(--text-muted); }

/* ===== Cards ===== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.4rem;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.45);
  box-shadow: var(--shadow);
  background: var(--surface-hover);
}
.card h3 { font-size: 1.05rem; margin-bottom: 0.4rem; }
.card h3 a { color: var(--text); }
.card h3 a:hover { color: var(--accent-2); text-decoration: none; }
.card-meta { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 0.5rem; }
.card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.8rem; }

/* ===== Chips (tags / skills) ===== */
.chip-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.chip {
  display: inline-block;
  padding: 0.18rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.28);
  color: var(--text);
}

/* ===== Skills ===== */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.2rem;
}
.skill-category h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
}

/* ===== About ===== */
.about { display: flex; gap: 2.5rem; align-items: flex-start; }
.about-content { flex: 1; color: var(--text-muted); }

/* ===== Filter buttons (projects/blog) ===== */
.filter-buttons { display: flex; gap: 0.7rem; margin-bottom: 1.6rem; flex-wrap: wrap; }
.filter-btn {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.88rem;
  font-family: inherit;
  transition: all 0.2s;
}
.filter-btn:hover { background: var(--surface-hover); color: var(--text); }
.filter-btn.active {
  background: var(--gradient);
  border-color: transparent;
  color: #fff;
}

/* ===== Posts / writing list ===== */
.post-item {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  padding: 0.55rem 0;
  border-bottom: 1px dashed var(--border);
}
.post-item:last-child { border-bottom: none; }
.post-date { color: var(--text-muted); font-size: 0.85rem; min-width: 100px; flex-shrink: 0; }

/* ===== Contact ===== */
.social-links { display: flex; gap: 0.8rem; flex-wrap: wrap; }

/* ===== Prose (markdown project/blog bodies) ===== */
.prose { color: var(--text); }
.prose h2 { margin: 2rem 0 0.8rem; font-size: 1.3rem; }
.prose h3 { margin: 1.5rem 0 0.6rem; font-size: 1.1rem; }
.prose p, .prose li { color: var(--text-muted); }
.prose ul, .prose ol { margin: 0 0 1rem 1.6rem; }
.prose ul { list-style: disc; }
.prose ol { list-style: decimal; }
.prose pre {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}
.prose code { font-family: 'Consolas', monospace; font-size: 0.88em; }
.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--text-muted);
  font-style: italic;
}
.prose a { color: var(--accent-2); }

/* ===== Footer ===== */
.site-footer {
  margin-top: 3rem;
  padding: 2rem 24px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}
.site-footer p { margin: 0; }

/* ===== Reveal-on-scroll ===== */
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .reveal { opacity: 1; transform: none; }
}

/* ===== Responsive ===== */
@media (max-width: 720px) {
  .hero { flex-direction: column-reverse; text-align: center; padding: 3rem 0 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-photo { width: 150px; height: 150px; }
  .about { flex-direction: column-reverse; align-items: center; text-align: left; }
  .nav-links { gap: 1rem; }
  .post-item { flex-direction: column; gap: 0.1rem; }
}
```

- [ ] **Step 2: Create `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';
import ChatBot from '../components/ChatBot.astro';

interface Props {
  title: string;
  description: string;
  active?: 'home' | 'projects' | 'blog' | 'none';
}
const { title, description, active = 'none' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<meta name="viewport" content="width=device-width" />
	<meta name="generator" content={Astro.generator} />
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content={description} />
	<title>{title}</title>
	<script defer src="https://cloud.umami.is/script.js" data-website-id="698c1618-48cf-423b-82af-eee68731e9c7"></script>
	<script is:inline>
		(function () {
			var t = 'dark';
			try { t = localStorage.getItem('theme') || 'dark'; } catch (e) {}
			document.documentElement.setAttribute('data-theme', t);
		})();
	</script>
</head>
<body>
	<header class="site-header">
		<nav class="nav container">
			<a href="/" class="brand">hari<span class="brand-accent">patel</span>.dev</a>
			<div class="nav-links">
				<a href="/" class={active === 'home' ? 'active' : ''}>Home</a>
				<a href="/projects" class={active === 'projects' ? 'active' : ''}>Projects</a>
				<a href="/blog" class={active === 'blog' ? 'active' : ''}>Blog</a>
				<button id="theme-toggle" class="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
					<span class="theme-icon-sun">☀️</span><span class="theme-icon-moon">🌙</span>
				</button>
			</div>
		</nav>
	</header>

	<main class="container">
		<slot />
	</main>

	<footer class="site-footer">
		<p>© {new Date().getFullYear()} Harikrushna Patel — built with Astro</p>
	</footer>

	<ChatBot />

	<script>
		const root = document.documentElement;
		document.getElementById('theme-toggle')?.addEventListener('click', () => {
			const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('theme', next); } catch { /* ignore */ }
		});

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.08 }
		);
		document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
	</script>
</body>
</html>
```

- [ ] **Step 3: Rewrite `src/pages/index.astro`**

```astro
---
export const prerender = true;

import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import { getHashnodeBlogs } from '../lib/hashnode';

const profile = await import('../data/profile.json');
const hashnodeBlogs = await getHashnodeBlogs(5);

const allProjects = await getCollection('projects');
const sortedProjects = allProjects.sort((a, b) =>
	(b.data.year || 0) - (a.data.year || 0)
);
---

<Layout title={profile.name} description={`${profile.name} - ${profile.title}`} active="home">
	<!-- Hero -->
	<section class="hero">
		<div>
			<p class="hero-eyebrow">Hi, I'm</p>
			<h1 class="hero-name">{profile.name}</h1>
			<p class="hero-tagline">{profile.tagline}</p>
			<div class="hero-actions">
				<a href="/projects" class="btn btn-primary">View Projects</a>
				<button id="hero-chat-cta" class="btn btn-ghost">💬 Chat with me</button>
			</div>
		</div>
		<img src="/cropped_circle_image.png" alt={profile.name} class="hero-photo" />
	</section>

	<!-- About -->
	<section class="section reveal">
		<h2 class="section-title">About</h2>
		<div class="about">
			<div class="about-content">
				{profile.about.map((paragraph) => <p>{paragraph}</p>)}
			</div>
		</div>
	</section>

	<!-- Skills -->
	{profile.showSkills && (
		<section class="section reveal">
			<h2 class="section-title">Skills</h2>
			<div class="skills-grid">
				{Object.entries(profile.skills).map(([category, items]) => (
					<div class="skill-category">
						<h3>{category}</h3>
						<div class="chip-row">
							{(items as string[]).map((item) => <span class="chip">{item}</span>)}
						</div>
					</div>
				))}
			</div>
		</section>
	)}

	<!-- Projects -->
	<section class="section reveal">
		<h2 class="section-title">Featured Projects</h2>
		<div class="card-grid">
			{sortedProjects.slice(0, 3).map((project) => (
				<article class="card">
					<h3><a href={`/projects/${project.slug}`}>{project.data.title}</a></h3>
					<p class="card-meta">{project.data.year}</p>
					<p>{project.data.description}</p>
					{project.data.tags && (
						<div class="chip-row">
							{project.data.tags.slice(0, 4).map((tag: string) => <span class="chip">{tag}</span>)}
						</div>
					)}
				</article>
			))}
		</div>
		<p style="margin-top: 1.5rem;"><a href="/projects">View all projects →</a></p>
	</section>

	<!-- Writing -->
	<section class="section reveal">
		<h2 class="section-title">Writing</h2>
		<ul>
			{hashnodeBlogs.map((post) => (
				<li class="post-item">
					<span class="post-date">{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
					<a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
				</li>
			))}
		</ul>
		<p style="margin-top: 1.5rem;"><a href="/blog">View all posts →</a></p>
	</section>

	<!-- Contact -->
	<section class="section reveal">
		<h2 class="section-title">Contact</h2>
		<div class="social-links">
			<a href={`mailto:${profile.email}`} class="btn btn-ghost">Email</a>
			<a href={profile.github} target="_blank" rel="noopener" class="btn btn-ghost">GitHub</a>
			{profile.twitter && <a href={profile.twitter} target="_blank" rel="noopener" class="btn btn-ghost">Twitter</a>}
			<a href={profile.linkedin} target="_blank" rel="noopener" class="btn btn-ghost">LinkedIn</a>
			{profile.medium && <a href={profile.medium} target="_blank" rel="noopener" class="btn btn-ghost">Medium</a>}
			{profile.blog && <a href={profile.blog} target="_blank" rel="noopener" class="btn btn-ghost">Blog</a>}
			{profile.cv && <a href={profile.cv} target="_blank" rel="noopener" class="btn btn-primary">Download CV</a>}
		</div>
	</section>
</Layout>

<script>
	document.getElementById('hero-chat-cta')?.addEventListener('click', () => {
		(document.getElementById('chatbot-toggle') as HTMLElement | null)?.click();
	});
</script>
```

- [ ] **Step 4: Set `"showSkills": true` in `src/data/profile.json`**

Change the line `"showSkills": false,` to `"showSkills": true,`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build completes with no errors (warnings from other, not-yet-migrated pages are OK).

- [ ] **Step 6: Verify visually**

Run: `npm run dev`, open http://localhost:4321/
Expected: dark hero with gradient name, sticky blurred nav, theme toggle switches to light and persists across reload, "Chat with me" opens the chatbot, sections fade in on scroll.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro src/pages/index.astro src/data/profile.json
git commit -m "feat: dark design system, shared layout, home page redesign"
```

---

### Task 2: Projects index + project detail redesign

**Files:**
- Rewrite: `src/pages/projects/index.astro`
- Rewrite: `src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: `Layout.astro` props and CSS classes from Task 1 (`.card`, `.card-grid`, `.chip`, `.chip-row`, `.filter-btn`, `.section-title`, `.prose`, `.btn`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Rewrite `src/pages/projects/index.astro`**

Keep the existing filter behavior (category buttons + company sub-filter) but render cards. Note `item.style.display` uses `''` (not `'block'`) so grid items restore correctly.

```astro
---
export const prerender = true;

import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';

const profile = await import('../../data/profile.json');
const allProjects = await getCollection('projects');

const sortedProjects = allProjects.sort((a, b) =>
	(b.data.year || 0) - (a.data.year || 0)
);
const personalProjects = sortedProjects.filter(p => p.data.category === 'personal');
const companyProjects = sortedProjects.filter(p => p.data.category === 'company');
const companies = [...new Set(companyProjects.map(p => p.data.company).filter(Boolean))];
---

<Layout title={`Projects - ${profile.name}`} description={`Projects by ${profile.name}`} active="projects">
	<section class="section">
		<h1 class="section-title" style="font-size: 1.8rem; margin-top: 2rem;">Projects</h1>
		<p class="tagline-muted" style="margin-bottom: 2rem;">Personal and professional work</p>

		<div class="filter-buttons">
			<button class="filter-btn active" data-filter="all">All ({sortedProjects.length})</button>
			<button class="filter-btn" data-filter="personal">Personal ({personalProjects.length})</button>
			<button class="filter-btn" data-filter="company">Company ({companyProjects.length})</button>
		</div>
		<div id="company-filters" class="filter-buttons" style="display: none;">
			<button class="filter-btn active" data-company="all">All Companies</button>
			{companies.map((company) => (
				<button class="filter-btn" data-company={company}>
					{company} ({companyProjects.filter(p => p.data.company === company).length})
				</button>
			))}
		</div>

		<div class="card-grid" id="projects-list">
			{sortedProjects.map((project) => (
				<article class="card project-item" data-category={project.data.category || 'none'} data-company={project.data.company || ''}>
					<h3><a href={`/projects/${project.slug}`}>{project.data.title}</a></h3>
					<p class="card-meta">
						{project.data.year}{project.data.company && ` · ${project.data.company}`}
					</p>
					<p>{project.data.description}</p>
					{project.data.tags && project.data.tags.length > 0 && (
						<div class="chip-row">
							{project.data.tags.slice(0, 5).map((tag: string) => <span class="chip">{tag}</span>)}
						</div>
					)}
				</article>
			))}
		</div>
	</section>

	<script>
		document.addEventListener('DOMContentLoaded', () => {
			const filterButtons = document.querySelectorAll<HTMLButtonElement>('button[data-filter]');
			// Scoped to #company-filters — the project cards also carry data-company attributes.
			const companyFilterButtons = document.querySelectorAll<HTMLButtonElement>('#company-filters button[data-company]');
			const projectItems = document.querySelectorAll<HTMLElement>('.project-item');
			const companyFilters = document.getElementById('company-filters');

			let currentCategory = 'all';
			let currentCompany = 'all';

			filterButtons.forEach(button => {
				button.addEventListener('click', () => {
					currentCategory = button.dataset.filter || 'all';
					filterButtons.forEach(btn => btn.classList.remove('active'));
					button.classList.add('active');

					if (currentCategory === 'company' && companyFilters) {
						companyFilters.style.display = 'flex';
					} else if (companyFilters) {
						companyFilters.style.display = 'none';
						currentCompany = 'all';
						companyFilterButtons.forEach(btn => btn.classList.remove('active'));
						companyFilterButtons[0]?.classList.add('active');
					}
					filterProjects();
				});
			});

			companyFilterButtons.forEach(button => {
				button.addEventListener('click', () => {
					currentCompany = button.dataset.company || 'all';
					companyFilterButtons.forEach(btn => btn.classList.remove('active'));
					button.classList.add('active');
					filterProjects();
				});
			});

			function filterProjects() {
				projectItems.forEach(item => {
					const category = item.dataset.category;
					const company = item.dataset.company;
					let show = false;
					if (currentCategory === 'all' || category === currentCategory) {
						if (currentCategory === 'company') {
							show = currentCompany === 'all' || company === currentCompany;
						} else {
							show = true;
						}
					}
					item.style.display = show ? '' : 'none';
				});
			}
		});
	</script>
</Layout>
```

(The `console.log` debug lines in the old frontmatter are intentionally dropped. The card `<article>` elements carry BOTH `card` and `project-item` classes — the filter script selects `.project-item`.)

- [ ] **Step 2: Rewrite `src/pages/projects/[slug].astro`**

```astro
---
export const prerender = true;

import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
	const projectEntries = await getCollection('projects');
	return projectEntries.map(entry => ({
		params: { slug: entry.slug },
		props: { entry },
	}));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<Layout title={`${entry.data.title} - Hari Patel`} description={entry.data.description || entry.data.title} active="projects">
	<article class="section">
		<p style="margin-top: 1.5rem;"><a href="/projects">← All projects</a></p>
		<h1 style="font-size: 2rem; margin-top: 1rem;">{entry.data.title}</h1>
		<p class="tagline-muted" style="margin-top: 0.4rem;">
			{entry.data.year && `${entry.data.year} · `}
			{entry.data.category && entry.data.category.charAt(0).toUpperCase() + entry.data.category.slice(1)}
			{entry.data.company && ` · ${entry.data.company}`}
		</p>

		{entry.data.tags && entry.data.tags.length > 0 && (
			<div class="chip-row" style="margin: 1rem 0 2rem;">
				{entry.data.tags.map((tag: string) => <span class="chip">{tag}</span>)}
			</div>
		)}

		<div class="prose">
			<Content />
		</div>

		{(entry.data.github || entry.data.link) && (
			<div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; flex-wrap: wrap;">
				{entry.data.github && (
					<a href={entry.data.github} target="_blank" rel="noopener" class="btn btn-ghost">View on GitHub →</a>
				)}
				{entry.data.link && (
					<a href={entry.data.link} target="_blank" rel="noopener" class="btn btn-primary">Visit Project →</a>
				)}
			</div>
		)}
	</article>
</Layout>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Verify visually**

Run: `npm run dev`, open http://localhost:4321/projects and click into one project.
Expected: card grid with hover lift, filters still work (All/Personal/Company + company sub-filter), detail page shows themed prose in both dark and light modes.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/index.astro "src/pages/projects/[slug].astro"
git commit -m "feat: redesign projects index and detail pages"
```

---

### Task 3: Blog index redesign

**Files:**
- Rewrite: `src/pages/blog/index.astro`

**Interfaces:**
- Consumes: Layout + CSS classes from Task 1.

- [ ] **Step 1: Rewrite `src/pages/blog/index.astro`**

```astro
---
export const prerender = true;

import Layout from '../../layouts/Layout.astro';
import { getHashnodeBlogs, groupBlogsBySeries } from '../../lib/hashnode';

const hashnodeBlogs = await getHashnodeBlogs(50);
const blogsBySeries = groupBlogsBySeries(hashnodeBlogs);
const series = Object.keys(blogsBySeries).sort();
---

<Layout title="Blog - Hari Patel" description="Blog posts and articles" active="blog">
	<section class="section">
		<h1 class="section-title" style="font-size: 1.8rem; margin-top: 2rem;">Writing</h1>
		<p class="tagline-muted" style="margin-bottom: 2rem;">Articles and thoughts on software development</p>

		<div class="filter-buttons">
			<button class="filter-btn active" data-category="all">All Posts ({hashnodeBlogs.length})</button>
			{series.map((seriesName) => (
				<button class="filter-btn" data-category={seriesName}>
					{seriesName} ({blogsBySeries[seriesName].length})
				</button>
			))}
		</div>

		<div class="card-grid">
			{hashnodeBlogs.map((post) => (
				<article class="card blog-item" data-series={post.series?.name || 'Uncategorized'}>
					<h3><a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a></h3>
					<p class="card-meta">
						{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
						{post.readTimeInMinutes && ` · ${post.readTimeInMinutes} min read`}
						{post.series && ` · ${post.series.name}`}
					</p>
					<p>{post.brief}</p>
					{post.tags && post.tags.length > 0 && (
						<div class="chip-row">
							{post.tags.slice(0, 4).map((tag) => <span class="chip">{tag.name}</span>)}
						</div>
					)}
				</article>
			))}
		</div>

		<p style="margin-top: 2.5rem; text-align: center;">
			<a href="https://blogs.haripatel.dev/" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
				Visit full blog site →
			</a>
		</p>
	</section>

	<script>
		const categoryButtons = document.querySelectorAll('.filter-btn');
		const blogItems = document.querySelectorAll<HTMLElement>('.blog-item');

		categoryButtons.forEach(button => {
			button.addEventListener('click', () => {
				const selectedCategory = button.getAttribute('data-category');
				categoryButtons.forEach(btn => btn.classList.remove('active'));
				button.classList.add('active');
				blogItems.forEach(item => {
					const itemSeries = item.getAttribute('data-series') || 'Uncategorized';
					if (selectedCategory === 'all') {
						item.style.display = '';
					} else if (selectedCategory) {
						item.style.display = itemSeries === selectedCategory ? '' : 'none';
					}
				});
			});
		});
	</script>
</Layout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, open http://localhost:4321/blog — cards render, series filters work, both themes look right.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: redesign blog index page"
```

---

### Task 4: Chat tool-call server library (TDD)

**Files:**
- Create: `src/lib/chat-tools.ts`
- Test: `src/lib/chat-tools.test.ts`
- Modify: `package.json` (add vitest devDependency + `test` script)

**Interfaces:**
- Produces (consumed by Task 5 `chat.ts` and mirrored client-side in Task 6):
  - `type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } }`
  - `type ChatMessage = { role: 'user'; content: string } | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] } | { role: 'tool'; tool_call_id: string; content: string }`
  - `validateChatMessages(raw: unknown): ChatMessage[]` — filters/cleans untrusted input; returns `[]` when nothing valid.
  - `accumulateToolCallDelta(acc: ToolCall[], deltas: unknown[] | undefined): ToolCall[]` — merges streamed OpenAI tool_call deltas (keyed by `index`, `arguments` concatenated).
  - `TOOL_DEFINITIONS` — OpenAI `tools` array with exactly these function names: `get_public_ip`, `get_location`, `get_device_details`, `get_network_info`, `get_battery_status` (all with empty parameter objects).
  - `TOOLS_SYSTEM_PROMPT: string` — paragraph appended to the system prompt.

- [ ] **Step 1: Install vitest and add test script**

```bash
npm install -D vitest
```

In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing tests — `src/lib/chat-tools.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { validateChatMessages, accumulateToolCallDelta, TOOL_DEFINITIONS } from './chat-tools';

describe('validateChatMessages', () => {
  it('keeps plain user/assistant messages', () => {
    const out = validateChatMessages([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ]);
    expect(out).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ]);
  });

  it('drops unknown roles, non-objects, and missing content', () => {
    const out = validateChatMessages([
      { role: 'system', content: 'evil override' },
      'garbage',
      null,
      { role: 'user' },
      { role: 'user', content: 'ok' },
    ]);
    expect(out).toEqual([{ role: 'user', content: 'ok' }]);
  });

  it('accepts assistant tool_calls and strips extra fields', () => {
    const out = validateChatMessages([
      {
        role: 'assistant',
        content: null,
        tool_calls: [
          { id: 'c1', type: 'function', function: { name: 'get_public_ip', arguments: '{}' }, extra: 'x' },
        ],
      },
    ]);
    expect(out).toEqual([
      {
        role: 'assistant',
        content: null,
        tool_calls: [{ id: 'c1', type: 'function', function: { name: 'get_public_ip', arguments: '{}' } }],
      },
    ]);
  });

  it('drops assistant tool_calls entries with malformed calls', () => {
    const out = validateChatMessages([
      { role: 'assistant', content: null, tool_calls: [{ id: 42, function: {} }] },
    ]);
    expect(out).toEqual([]);
  });

  it('accepts tool messages, strips extra fields, caps content at 4000 chars', () => {
    const out = validateChatMessages([
      { role: 'tool', tool_call_id: 'c1', content: 'x'.repeat(5000), name: 'get_public_ip' },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({ role: 'tool', tool_call_id: 'c1', content: 'x'.repeat(4000) });
  });

  it('rejects tool messages missing tool_call_id', () => {
    expect(validateChatMessages([{ role: 'tool', content: 'r' }])).toEqual([]);
  });

  it('returns [] for non-array input', () => {
    expect(validateChatMessages('nope')).toEqual([]);
    expect(validateChatMessages(undefined)).toEqual([]);
  });
});

describe('accumulateToolCallDelta', () => {
  it('builds a tool call from incremental deltas', () => {
    let acc: ReturnType<typeof accumulateToolCallDelta> = [];
    acc = accumulateToolCallDelta(acc, [
      { index: 0, id: 'c1', function: { name: 'get_public_ip', arguments: '' } },
    ]);
    acc = accumulateToolCallDelta(acc, [{ index: 0, function: { arguments: '{' } }]);
    acc = accumulateToolCallDelta(acc, [{ index: 0, function: { arguments: '}' } }]);
    expect(acc).toEqual([
      { id: 'c1', type: 'function', function: { name: 'get_public_ip', arguments: '{}' } },
    ]);
  });

  it('handles multiple parallel tool calls by index', () => {
    let acc: ReturnType<typeof accumulateToolCallDelta> = [];
    acc = accumulateToolCallDelta(acc, [
      { index: 0, id: 'a', function: { name: 'get_device_details', arguments: '{}' } },
      { index: 1, id: 'b', function: { name: 'get_network_info', arguments: '{}' } },
    ]);
    expect(acc).toHaveLength(2);
    expect(acc[1].function.name).toBe('get_network_info');
  });

  it('ignores undefined deltas', () => {
    expect(accumulateToolCallDelta([], undefined)).toEqual([]);
  });
});

describe('TOOL_DEFINITIONS', () => {
  it('defines the five browser tools', () => {
    const names = TOOL_DEFINITIONS.map((t) => t.function.name);
    expect(names).toEqual([
      'get_public_ip',
      'get_location',
      'get_device_details',
      'get_network_info',
      'get_battery_status',
    ]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `./chat-tools`.

- [ ] **Step 4: Implement `src/lib/chat-tools.ts`**

```ts
// Shared server-side logic for chatbot browser-tool calling.

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export type ChatMessage =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string };

const MAX_TOOL_CONTENT = 4000;

function cleanToolCalls(raw: unknown): ToolCall[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: ToolCall[] = [];
  for (const c of raw) {
    if (typeof c !== 'object' || c === null) return null;
    const t = c as { id?: unknown; function?: { name?: unknown; arguments?: unknown } };
    if (
      typeof t.id !== 'string' ||
      typeof t.function?.name !== 'string' ||
      typeof t.function?.arguments !== 'string'
    ) {
      return null;
    }
    out.push({ id: t.id, type: 'function', function: { name: t.function.name, arguments: t.function.arguments } });
  }
  return out;
}

export function validateChatMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (typeof m !== 'object' || m === null) continue;
    const msg = m as Record<string, unknown>;
    if (msg.role === 'user' && typeof msg.content === 'string') {
      out.push({ role: 'user', content: msg.content });
    } else if (msg.role === 'assistant' && msg.tool_calls !== undefined) {
      const calls = cleanToolCalls(msg.tool_calls);
      if (calls) {
        out.push({
          role: 'assistant',
          content: typeof msg.content === 'string' ? msg.content : null,
          tool_calls: calls,
        });
      }
    } else if (msg.role === 'assistant' && typeof msg.content === 'string') {
      out.push({ role: 'assistant', content: msg.content });
    } else if (
      msg.role === 'tool' &&
      typeof msg.tool_call_id === 'string' &&
      typeof msg.content === 'string'
    ) {
      out.push({ role: 'tool', tool_call_id: msg.tool_call_id, content: msg.content.slice(0, MAX_TOOL_CONTENT) });
    }
  }
  return out;
}

export function accumulateToolCallDelta(acc: ToolCall[], deltas: unknown[] | undefined): ToolCall[] {
  if (!Array.isArray(deltas)) return acc;
  for (const d of deltas) {
    if (typeof d !== 'object' || d === null) continue;
    const delta = d as { index?: number; id?: string; function?: { name?: string; arguments?: string } };
    const i = delta.index ?? 0;
    if (!acc[i]) acc[i] = { id: '', type: 'function', function: { name: '', arguments: '' } };
    if (delta.id) acc[i].id = delta.id;
    if (delta.function?.name) acc[i].function.name += delta.function.name;
    if (delta.function?.arguments) acc[i].function.arguments += delta.function.arguments;
  }
  return acc;
}

const emptyParams = { type: 'object' as const, properties: {}, required: [] };

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_public_ip',
      description:
        "Get the visitor's public IP address and approximate location (city, region, country, ISP, timezone) via a browser-side lookup. Use when the visitor asks about their IP, ISP, or approximate location.",
      parameters: emptyParams,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_location',
      description:
        "Get the visitor's precise GPS coordinates via the browser Geolocation API. This shows the visitor a browser permission popup — use only when they explicitly ask for their exact/precise location.",
      parameters: emptyParams,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_device_details',
      description:
        "Get details about the visitor's device and browser: user agent, platform, language, timezone, screen size, CPU cores, memory, touch support.",
      parameters: emptyParams,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_network_info',
      description:
        "Get the visitor's network connection info: online status, effective connection type, downlink speed, round-trip time.",
      parameters: emptyParams,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_battery_status',
      description:
        "Get the visitor's device battery level and charging status. Only supported in Chromium browsers; returns an error elsewhere.",
      parameters: emptyParams,
    },
  },
];

export const TOOLS_SYSTEM_PROMPT = `
You also have browser tools that run on the visitor's own device. Use them ONLY when the visitor asks about their own environment (their IP, location, device, network, or battery) — never for questions about Harikrushna. After a tool result arrives, summarise it conversationally in plain language; do not dump raw JSON. If a tool returns an error, explain it simply (e.g. permission denied, unsupported browser). Never invent values a tool did not return.`;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/chat-tools.ts src/lib/chat-tools.test.ts package.json package-lock.json
git commit -m "feat: chat tool-call validation, delta accumulation, tool definitions (TDD)"
```

---

### Task 5: Chat API — tools + model switch

**Files:**
- Modify: `src/pages/api/chat.ts`

**Interfaces:**
- Consumes: everything Task 4 produces.
- Produces (SSE protocol consumed by Task 6): unchanged `data: {"content": "..."}` chunks; NEW single `data: {"tool_calls": ToolCall[]}` event emitted after the stream ends when the model requested tools; then `data: [DONE]`.

- [ ] **Step 1: Update imports and validation in `src/pages/api/chat.ts`**

Add to imports at the top:

```ts
import {
  validateChatMessages,
  accumulateToolCallDelta,
  TOOL_DEFINITIONS,
  TOOLS_SYSTEM_PROMPT,
  type ToolCall,
} from '../../lib/chat-tools';
```

Replace the whole block from `const allowedRoles = new Set(['user', 'assistant']);` down to (and including) the `if (validatedMessages.length === 0) { ... }` guard's closing brace with:

```ts
  const validatedMessages = validateChatMessages(userMessages);

  if (validatedMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'At least one valid message is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
```

- [ ] **Step 2: Fix RAG query to use the last USER message**

Replace:

```ts
  const lastUserMsg = validatedMessages[validatedMessages.length - 1].content;
```

with (the last message may now be a `tool` result):

```ts
  const lastUser = [...validatedMessages].reverse().find((m) => m.role === 'user');
  const lastUserMsg = lastUser?.content ?? '';
```

- [ ] **Step 3: Append tools prompt in `buildSystemPrompt`**

At the end of the template string returned by `buildSystemPrompt`, append `${TOOLS_SYSTEM_PROMPT}` (i.e. the last line becomes `...rather than making things up.${TOOLS_SYSTEM_PROMPT}`).

- [ ] **Step 4: Switch model, pass tools, and forward tool calls over SSE**

Replace the `openai.chat.completions.create({...})` call and the `ReadableStream` block with:

```ts
    const stream = await openai.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
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
```

(Note `max_tokens` raised 512 → 1024: tool-result summaries plus normal answers need headroom. `stream: true` with `tools` is supported by NVIDIA's OpenAI-compatible endpoint.)

- [ ] **Step 5: Verify build + live API check**

Run: `npm run build`
Expected: success (type errors here usually mean the messages cast in Step 4 was omitted).

Run the dev server and exercise the API (requires `.env` with `NVIDIA_API_KEY`):

```bash
npm run dev
curl -N -X POST http://localhost:4321/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"what is my public ip?\"}]}"
```

Expected: SSE output ending with a `data: {"tool_calls":[{"id":...,"function":{"name":"get_public_ip"...` event before `data: [DONE]`.

Also verify a normal question still streams text:

```bash
curl -N -X POST http://localhost:4321/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"what are Hari's main skills?\"}]}"
```

Expected: `data: {"content":"..."}` chunks, no tool_calls event.

- [ ] **Step 6: Commit**

```bash
git add src/pages/api/chat.ts
git commit -m "feat: tool calling in chat API, switch to llama-3.3-70b"
```

---

### Task 6: ChatBot client — browser tools + tool loop

**Files:**
- Modify: `src/components/ChatBot.astro` (style block additions + script rewrite)

**Interfaces:**
- Consumes: SSE protocol from Task 5; message shapes from Task 4 (`tool` messages additionally carry a `name` field client-side for display on restore — the server strips it).

- [ ] **Step 1: Add tool-bubble styles**

In the `<style is:global>` block of `ChatBot.astro`, insert after the `.chatbot-msg-row .user-bubble { ... }` rule:

```css
  /* Browser tool activity bubbles */
  .chatbot-msg-row.tool-row { align-self: center; max-width: 92%; margin: 0 auto; }
  .chatbot-bubble.tool-bubble {
    background: rgba(240, 167, 66, 0.08);
    border: 1px dashed rgba(240, 167, 66, 0.55);
    border-radius: 10px;
    color: #92610e;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 0.74rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 8px 12px;
  }
  [data-theme="dark"] .chatbot-bubble.tool-bubble {
    color: #f3d9a4;
    background: rgba(240, 167, 66, 0.07);
  }
```

Also update the input placeholder in the HTML at the top of the file:

```html
    <input
      id="chatbot-input"
      type="text"
      placeholder="Ask about Hari — or try 'what's my IP?'"
      autocomplete="off"
    />
```

And the greeting bubble text:

```
        Hi! I'm an AI assistant. Ask me anything about Harikrushna's skills, experience, or projects — or try "what's my IP?"
```

- [ ] **Step 2: Rewrite the `<script>` block**

Keep everything from the top of the script through the `showTyping()` function UNCHANGED, except:

(a) Broaden the history type (replace the `let conversationHistory ...` declaration):

```ts
  type HistoryMessage = {
    role: string;
    content: string | null;
    tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }>;
    tool_call_id?: string;
    name?: string;
  };
  let conversationHistory: HistoryMessage[] = [];
```

(b) Replace the message-restore loop inside `restoreChat()` with:

```ts
    for (const msg of conversationHistory) {
      if (msg.role === 'user' && msg.content) appendMessage(msg.content, 'user');
      else if (msg.role === 'assistant') {
        if (Array.isArray(msg.tool_calls)) {
          for (const c of msg.tool_calls) appendToolBubble(`▶ ${c.function.name}()`);
        }
        if (msg.content) appendMessage(msg.content, 'bot');
      } else if (msg.role === 'tool' && msg.content) {
        appendToolBubble(`${msg.name || 'tool'} → ${msg.content}`);
      }
    }
```

(c) Add `appendToolBubble` after the `appendMessage` function:

```ts
  function appendToolBubble(text: string) {
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row tool-row';
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble tool-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
```

- [ ] **Step 3: Add browser tool implementations**

Insert after `appendToolBubble` (before the submit handler):

```ts
  // ===== Browser tools (executed on the visitor's device) =====
  const browserTools: Record<string, () => Promise<Record<string, unknown>>> = {
    async get_public_ip() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error(`ipapi ${res.status}`);
        const d = await res.json();
        return {
          ip: d.ip,
          city: d.city,
          region: d.region,
          country: d.country_name,
          isp: d.org,
          timezone: d.timezone,
        };
      } catch {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const d = await res.json();
          return { ip: d.ip, note: 'Only the IP could be determined (geo lookup unavailable).' };
        } catch {
          return { error: 'Could not determine the public IP (both lookup services failed).' };
        }
      }
    },

    get_location() {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          return resolve({ error: 'Geolocation is not supported by this browser.' });
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy_meters: pos.coords.accuracy,
          }),
          (err) => resolve({ error: `Could not get location: ${err.message}` }),
          { timeout: 10000 }
        );
      });
    },

    async get_device_details() {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: { width: screen.width, height: screen.height, pixelRatio: window.devicePixelRatio },
        cpuCores: navigator.hardwareConcurrency ?? 'unknown',
        deviceMemoryGB: (navigator as any).deviceMemory ?? 'unknown',
        touchSupport: navigator.maxTouchPoints > 0,
        cookiesEnabled: navigator.cookieEnabled,
      };
    },

    async get_network_info() {
      const c = (navigator as any).connection;
      return {
        online: navigator.onLine,
        effectiveType: c?.effectiveType ?? 'unknown',
        downlinkMbps: c?.downlink ?? 'unknown',
        rttMs: c?.rtt ?? 'unknown',
        saveData: c?.saveData ?? 'unknown',
      };
    },

    async get_battery_status() {
      const nav = navigator as any;
      if (!nav.getBattery) {
        return { error: 'The Battery API is not supported by this browser (Chromium only).' };
      }
      const b = await nav.getBattery();
      return {
        levelPercent: Math.round(b.level * 100),
        charging: b.charging,
      };
    },
  };

  async function executeBrowserTool(name: string): Promise<Record<string, unknown>> {
    const fn = browserTools[name];
    if (!fn) return { error: `Unknown tool: ${name}` };
    try {
      return await fn();
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Tool failed' };
    }
  }
```

- [ ] **Step 4: Replace the submit handler with the tool loop**

Replace the entire `form.addEventListener('submit', ...)` block with:

```ts
  // ===== Streaming + tool loop =====
  const MAX_TOOL_ROUNDS = 5;

  async function streamAssistantTurn(): Promise<{ content: string; toolCalls: NonNullable<HistoryMessage['tool_calls']> }> {
    const typingRow = showTyping();
    let res: Response;
    try {
      res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });
    } finally {
      typingRow.remove();
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errData.error || 'Something went wrong.');
    }

    let bubble: HTMLElement | null = null;
    let fullText = '';
    let toolCalls: NonNullable<HistoryMessage['tool_calls']> = [];
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') continue;
        try {
          const data = JSON.parse(payload);
          if (data.content) {
            if (!bubble) bubble = createBotRow().bubble;
            fullText += data.content;
            bubble.innerHTML = renderMarkdown(fullText);
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
          if (Array.isArray(data.tool_calls)) toolCalls = data.tool_calls;
          if (data.error) {
            if (!bubble) bubble = createBotRow().bubble;
            bubble.innerHTML = renderMarkdown(fullText + '\n\n⚠️ ' + data.error);
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    if (toolCalls.length > 0) {
      conversationHistory.push({ role: 'assistant', content: fullText || null, tool_calls: toolCalls });
    } else if (fullText) {
      conversationHistory.push({ role: 'assistant', content: fullText });
    }
    saveHistory();
    return { content: fullText, toolCalls };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';
    conversationHistory.push({ role: 'user', content: text });
    saveHistory();

    const sendBtn = form.querySelector('.chatbot-send') as HTMLButtonElement;
    sendBtn.disabled = true;
    input.disabled = true;

    try {
      for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const { toolCalls } = await streamAssistantTurn();
        if (toolCalls.length === 0) break;
        if (round === MAX_TOOL_ROUNDS) {
          appendMessage('⚠️ Stopped: too many tool calls in one turn.', 'bot');
          break;
        }
        for (const call of toolCalls) {
          appendToolBubble(`▶ ${call.function.name}()`);
          const result = await executeBrowserTool(call.function.name);
          appendToolBubble(`${call.function.name} → ${JSON.stringify(result, null, 2)}`);
          conversationHistory.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(result),
            name: call.function.name,
          });
          saveHistory();
        }
      }
    } catch (err) {
      appendMessage(err instanceof Error ? err.message : 'Failed to connect. Please try again later.', 'bot');
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Verify end-to-end in the browser**

Run: `npm run dev`, open http://localhost:4321/, open the chatbot, and test:

| Prompt | Expected |
|---|---|
| "what's my public IP?" | amber tool bubbles `▶ get_public_ip()` + JSON result, then a conversational answer with IP/city/ISP |
| "where am I exactly?" | browser permission popup; on Allow → coordinates; on Block → bot explains it was denied |
| "what device am I using?" | device summary, no permission prompt |
| "how's my internet connection?" | network summary |
| "what's my battery level?" | level/charging in Chrome; polite unsupported message in Firefox |
| "what are Hari's main skills?" | normal RAG answer, NO tool bubbles |

Then navigate Home → Projects and reopen the chat: history including tool bubbles is restored.

- [ ] **Step 7: Commit**

```bash
git add src/components/ChatBot.astro
git commit -m "feat: browser tools in chatbot — public IP, geo, device, network, battery"
```

---

### Task 7: Final verification pass

**Files:** none (verification only; fix anything found and commit fixes individually).

- [ ] **Step 1: Full test + build**

```bash
npx vitest run
npm run build
```
Expected: all tests pass, build succeeds.

- [ ] **Step 2: Manual sweep**

With `npm run dev`:
- All 4 page types (home, projects, one project detail, blog) in dark AND light mode — no unstyled/washed-out elements.
- Mobile viewport (~375px wide): hero stacks, nav fits, cards single-column, chatbot usable.
- Theme choice persists across pages and reloads.
- OS "reduce motion" enabled → no reveal animations, content visible immediately.
- Chatbot regression: markdown links in answers still clickable, fullscreen toggle works, history survives navigation.

- [ ] **Step 3: Commit any fixes, then report**

Stop here — integration (merge/push/deploy and vector re-seed decision) is handled per the superpowers:finishing-a-development-branch skill with the user.
