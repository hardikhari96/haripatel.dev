# haripatel.dev — Modern Redesign + Chatbot Browser Tools

**Date:** 2026-07-20
**Status:** Approved by Hari (design + model upgrade)

## Goal

1. Redesign the site from the current minimal/brutalist light-only look into a modern dark-first portfolio.
2. Give the AI chatbot client-side "browser tools" (same pattern as the AI Loop project) so it can answer questions like "what's my IP?", "where am I?", "what device am I using?" using real browser APIs.

## Out of Scope

- RAG / Upstash Vector pipeline, seed API, Hashnode blog fetching, project markdown content — all unchanged.
- No new npm dependencies for the design (vanilla CSS + Astro only).

---

## Part 1 — Visual Redesign

### Theme

- Dark-first, with a light mode toggle (replaces the disabled festival ThemeToggle; festival/season components stay unused).
- CSS custom properties in `src/styles/global.css`:
  - Background near-black (`#0a0d14` family), elevated surfaces slightly lighter.
  - One accent gradient: indigo → cyan. Used for the hero name, buttons, link hovers, card glows.
  - Glassy cards: subtle translucent surface, 1px soft border, rounded corners, hover lift + glow.
- Theme toggle: button in nav, persists `data-theme` in `localStorage`, applied on `<html>` before paint (inline script to avoid flash).
- Max content width ~1000px (up from 680px), fully responsive down to mobile.
- Motion: fade/slide-in on scroll via `IntersectionObserver` + CSS, hover transitions. Respect `prefers-reduced-motion`.

### Structure

- **New `src/layouts/Layout.astro`** — consolidates `<head>` (meta, favicon, umami analytics), nav, footer, and `<ChatBot />`. All four pages migrate to it:
  - `src/pages/index.astro`
  - `src/pages/projects/index.astro`
  - `src/pages/projects/[slug].astro`
  - `src/pages/blog/index.astro`

### Pages

- **Home**: hero (greeting, gradient name, tagline, CTA buttons "View Projects" and "Chat with me" — the latter opens the chatbot; circular photo with accent glow) → About → Skills as badge chips grouped by category → top-3 projects as cards → Writing list → Contact links with icons.
- **Projects index**: responsive card grid (title, description, year, tags as chips); keep personal/company grouping.
- **Project detail**: themed prose styling for rendered markdown, back link, tag chips, GitHub/live links as buttons.
- **Blog index**: themed list/cards of Hashnode posts.

---

## Part 2 — Chatbot Browser Tools

### Pattern (from AI Loop)

Client-side tool loop: the LLM returns `tool_calls`; the browser executes real APIs and pushes results back as `role: "tool"` messages; loop continues (max 5 rounds) until the model answers in plain text.

### Tools (all five)

| Tool | Source | Notes |
|---|---|---|
| `get_public_ip` | `fetch('https://ipapi.co/json/')` | IP, city, region, country, ISP/org, timezone. No permission prompt. Fallback to `api.ipify.org?format=json` (IP only) if ipapi fails/rate-limits. |
| `get_device_details` | `navigator.*`, `screen`, `Intl` | userAgent, platform, language, timezone, screen size/DPR, CPU cores, memory, touch. Silent. |
| `get_network_info` | `navigator.connection` | online, effectiveType, downlink, rtt, saveData; `unknown` where unsupported. |
| `get_location` | `navigator.geolocation` | Precise lat/long; triggers browser permission prompt; graceful error on deny/timeout. |
| `get_battery_status` | `navigator.getBattery()` | Chrome/Edge only; returns a clear "not supported" error elsewhere. |

Every tool returns a JSON object; failures resolve to `{ error: "..." }` (never throw) so the model can explain the failure to the visitor.

### Server changes — `src/pages/api/chat.ts`

- **Model**: switch to `meta/llama-3.3-70b-instruct` (same NVIDIA endpoint/key) for reliable tool calling.
- **Message validation**: additionally accept
  - assistant messages carrying `tool_calls` (validated shape: `id`, `function.name`, `function.arguments` strings), and
  - `role: "tool"` messages with `tool_call_id` + string content (length-capped).
- **Request**: pass `tools` (the five function definitions) on every completion call, keep `stream: true`.
- **SSE protocol**: existing `data: {content}` chunks unchanged; tool calls are accumulated from streamed deltas server-side and emitted as one `data: {tool_calls: [...]}` event before `data: [DONE]`.
- **System prompt**: add a section describing the tools and when to use them (visitor asks about their IP, location, device, network, battery), and to ask before using precise geolocation only if conversationally appropriate — the browser prompt is the real consent gate.

### Client changes — `src/components/ChatBot.astro`

- `browserTools` map implementing the five tools.
- SSE consumer additionally handles the `tool_calls` event: render a "browser" bubble (`▶ running get_public_ip()…` then the JSON result, styled distinctly — monospace, accent-amber tint adapted to the new theme), execute, append `{role:'tool', tool_call_id, content}` to history, and re-POST to `/api/chat`. Max 5 rounds per user turn, then an error bubble.
- Tool messages persist in the existing `sessionStorage` history so the loop state survives page navigation.
- Placeholder text updated to hint at the new abilities (e.g. "Ask about Hari — or try 'what's my IP?'").

### Error handling

- Tool execution never rejects; errors become `{error}` results the model can relay.
- Malformed/unknown tool calls from the model → `{ error: "Unknown tool" }` result, loop continues.
- ipapi rate-limit (HTTP 429) → ipify fallback → `{error}` if both fail.

---

## Testing

- Manual: `npm run dev`, verify all four pages in dark + light mode, mobile viewport, reduced-motion.
- Chatbot: exercise each tool by prompt ("what's my ip", "where am I exactly", "what device am I on", "how's my connection", "battery?"), verify deny-permission and unsupported-browser paths, verify normal RAG questions still stream fine, verify history persistence across navigation.
- `npm run build` passes.

## Deployment

Work on a feature branch off `astro_project`; merge/push per existing flow (Vercel auto-deploy). No vector re-seed needed (no data changes).
