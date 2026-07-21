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
