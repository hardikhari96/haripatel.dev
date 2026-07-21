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

  it('treats assistant messages with empty or null tool_calls as plain content', () => {
    const out = validateChatMessages([
      { role: 'assistant', content: 'hi', tool_calls: [] },
      { role: 'assistant', content: 'yo', tool_calls: null },
    ]);
    expect(out).toEqual([
      { role: 'assistant', content: 'hi' },
      { role: 'assistant', content: 'yo' },
    ]);
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
