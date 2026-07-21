// Shared, server-validated list of free OpenRouter models the visitor may pick.
// Every entry is a ':free' tier model that advertises tool / function-calling
// support — which the chatbot's browser tools depend on. This list is also the
// security allowlist: the /api/chat endpoint only honours a requested model that
// appears here, so a visitor can never make us bill against a paid model.
//
// Free models come and go — keep this in sync with the tool-capable free models at
// https://openrouter.ai/collections/free-models

export interface ModelOption {
  id: string;
  label: string;
  blurb: string;   // what this model is best at
  context: string; // human-readable context window
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'google/gemma-4-31b-it:free',
    label: 'Google Gemma 4 31B',
    blurb: 'Balanced all-rounder with strong instruction-following — the reliable default.',
    context: '256K',
  },
  {
    id: 'openai/gpt-oss-20b:free',
    label: 'OpenAI gpt-oss 20B',
    blurb: 'Fast and lightweight — best for snappy back-and-forth Q&A.',
    context: '128K',
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    label: 'NVIDIA Nemotron 3 Super',
    blurb: 'Deepest reasoning and multi-step tool use — best for complex questions (slower).',
    context: '1M',
  },
  {
    id: 'poolside/laguna-m.1:free',
    label: 'Poolside Laguna M.1',
    blurb: 'Flagship coding agent — best for code, debugging and technical deep-dives.',
    context: '256K',
  },
  {
    id: 'cohere/north-mini-code:free',
    label: 'Cohere North Mini Code',
    blurb: 'Efficient agentic coder — quick, structured answers to technical asks.',
    context: '256K',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    label: 'NVIDIA Nemotron 3 Nano',
    blurb: 'Compact and low-latency — efficient agentic replies on a budget.',
    context: '256K',
  },
  {
    id: 'openrouter/free',
    label: 'Auto (Free Router)',
    blurb: 'Routes to any available free model — most resilient, least predictable.',
    context: '200K',
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
