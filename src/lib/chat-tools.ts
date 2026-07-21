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
    } else if (msg.role === 'assistant' && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
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
  {
    type: 'function' as const,
    function: {
      name: 'list_directory',
      description:
        "Ask the visitor to pick a folder on their own device, then return metadata about its contents: each entry's name, whether it is a file or directory, and for files the size, MIME type, whether it looks like a text file, and last-modified date. Reads metadata ONLY — never the contents of any file. Shows the visitor a 'Choose folder' button they must click, then a native folder picker. Only supported in Chromium browsers (Chrome, Edge, Opera); returns an error elsewhere. Use only when the visitor explicitly asks to inspect or list files in a folder.",
      parameters: emptyParams,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_folder',
      description:
        "Create a new folder inside a folder the visitor picks on their own device. The browser asks the visitor for read-write permission and they choose the target folder. Intermediate folders in the path are created as needed. Only supported in Chromium browsers; returns an error elsewhere. Use ONLY when the visitor explicitly asks to create a folder.",
      parameters: {
        type: 'object' as const,
        properties: {
          path: {
            type: 'string',
            description: "Relative path of the folder to create inside the picked folder, e.g. 'notes' or 'reports/2026'.",
          },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_file',
      description:
        "Create or overwrite a text file inside a folder the visitor picks on their own device, writing the given text content into it. The browser asks the visitor for read-write permission. Intermediate folders in the path are created as needed. Overwrites an existing file at the same path. Only supported in Chromium browsers; returns an error elsewhere. Use ONLY when the visitor explicitly asks to create or save a file.",
      parameters: {
        type: 'object' as const,
        properties: {
          path: {
            type: 'string',
            description: "Relative path of the file to create or overwrite, e.g. 'notes/hello.txt'.",
          },
          content: {
            type: 'string',
            description: 'The text content to write into the file.',
          },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'delete_entry',
      description:
        "Delete a file or folder inside a folder the visitor picks on their own device. Folders are removed recursively along with everything inside them. This is destructive and cannot be undone. The browser asks the visitor for read-write permission. Only supported in Chromium browsers; returns an error elsewhere. Use ONLY when the visitor has clearly and explicitly asked to delete that specific file or folder.",
      parameters: {
        type: 'object' as const,
        properties: {
          path: {
            type: 'string',
            description: "Relative path of the file or folder to delete inside the picked folder, e.g. 'old.txt' or 'reports/2025'.",
          },
        },
        required: ['path'],
      },
    },
  },
];

export const TOOLS_SYSTEM_PROMPT = `
You also have browser tools that run on the visitor's own device. Use them ONLY when the visitor asks about their own environment (their IP, location, device, network, battery, or files and folders they want to inspect or manage) — never for questions about Harikrushna. The list_directory tool reads only file metadata (names, sizes, types) after the visitor picks a folder and never reads file contents. The create_folder, create_file, and delete_entry tools modify real files inside a folder the visitor picks; the browser asks them for read-write permission first. Only call a write tool when the visitor has clearly and explicitly asked for that specific action, and NEVER call delete_entry unless they explicitly named what to delete — deletion is permanent. If a tool returns a "cancelled" result, simply acknowledge that they declined. After a tool result arrives, summarise it conversationally in plain language; do not dump raw JSON. If a tool returns an error, explain it simply (e.g. permission denied, unsupported browser). Never invent values a tool did not return.`;
