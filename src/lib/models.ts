// Shared, server-validated list of free OpenRouter models the visitor may pick.
// Every entry is a ':free' tier model that advertises tool / function-calling
// support — which the chatbot's browser tools depend on. This list is also the
// security allowlist: the /api/chat endpoint only honours a requested model that
// appears here, so a visitor can never make us bill against a paid model.
//
// The speed / reliability / latencyMs ratings below are a SNAPSHOT measured
// against OpenRouter on 2026-07-21 (3 spaced passes per model). Free-tier
// availability shifts over time — re-run the benchmark and refresh these
// occasionally. Free models come and go: keep this in sync with the tool-capable
// free models at https://openrouter.ai/collections/free-models

export type SpeedRating = 'fast' | 'medium' | 'slow' | 'unknown';
export type ReliabilityRating = 'high' | 'medium' | 'low';

export interface ModelOption {
  id: string;
  label: string;
  blurb: string;                  // what this model is best at
  context: string;                // human-readable context window
  speed: SpeedRating;             // from measured response latency
  reliability: ReliabilityRating; // from measured success rate (free-tier rate limiting)
  latencyMs: number | null;       // approx median response latency, null if unmeasured
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    label: 'NVIDIA Nemotron 3 Super',
    blurb: 'Reliable, responsive all-rounder with deep reasoning and strong tool use — the default.',
    context: '1M',
    speed: 'medium',
    reliability: 'high',
    latencyMs: 990,
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    label: 'NVIDIA Nemotron 3 Nano',
    blurb: 'Compact and the quickest to respond — great for fast, simple answers.',
    context: '256K',
    speed: 'fast',
    reliability: 'medium',
    latencyMs: 650,
  },
  {
    id: 'openrouter/free',
    label: 'Auto (Free Router)',
    blurb: 'Routes to any available free model — resilient and quick, but least predictable.',
    context: '200K',
    speed: 'fast',
    reliability: 'medium',
    latencyMs: 820,
  },
  {
    id: 'openai/gpt-oss-20b:free',
    label: 'OpenAI gpt-oss 20B',
    blurb: 'Lightweight and familiar, but slower and frequently rate-limited on the free tier.',
    context: '128K',
    speed: 'slow',
    reliability: 'low',
    latencyMs: 1550,
  },
  {
    id: 'poolside/laguna-m.1:free',
    label: 'Poolside Laguna M.1',
    blurb: 'Flagship coding agent — best for code, but its free tier is usually unavailable.',
    context: '256K',
    speed: 'unknown',
    reliability: 'low',
    latencyMs: null,
  },
  {
    id: 'cohere/north-mini-code:free',
    label: 'Cohere North Mini Code',
    blurb: 'Efficient agentic coder — capable, but its free tier is usually unavailable.',
    context: '256K',
    speed: 'unknown',
    reliability: 'low',
    latencyMs: null,
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

const ALLOWED_IDS = new Set(AVAILABLE_MODELS.map((m) => m.id));

export function isAllowedModel(id: unknown): id is string {
  return typeof id === 'string' && ALLOWED_IDS.has(id);
}

// Return the requested model if it is allow-listed; otherwise the fallback (also
// validated), otherwise the default. Guarantees the returned id is always safe.
export function resolveModel(requested: unknown, fallback: string = DEFAULT_MODEL): string {
  if (isAllowedModel(requested)) return requested;
  return isAllowedModel(fallback) ? fallback : DEFAULT_MODEL;
}
