import { describe, it, expect } from 'vitest';
import { AVAILABLE_MODELS, DEFAULT_MODEL, resolveModel, isAllowedModel } from './models';

describe('models', () => {
  it('exposes a non-empty list with the default first', () => {
    expect(AVAILABLE_MODELS.length).toBeGreaterThan(0);
    expect(DEFAULT_MODEL).toBe(AVAILABLE_MODELS[0].id);
  });

  it('only lists free-tier ids and requires display fields', () => {
    for (const m of AVAILABLE_MODELS) {
      expect(m.id === 'openrouter/free' || m.id.endsWith(':free')).toBe(true);
      expect(m.label.length).toBeGreaterThan(0);
      expect(m.blurb.length).toBeGreaterThan(0);
      expect(m.context.length).toBeGreaterThan(0);
    }
  });

  it('resolveModel accepts an allow-listed id', () => {
    const id = AVAILABLE_MODELS[1].id;
    expect(resolveModel(id)).toBe(id);
  });

  it('resolveModel rejects unknown or non-string ids and falls back to default', () => {
    expect(resolveModel('anthropic/claude-opus')).toBe(DEFAULT_MODEL);
    expect(resolveModel('meta-llama/llama-3.3-70b-instruct')).toBe(DEFAULT_MODEL);
    expect(resolveModel(123)).toBe(DEFAULT_MODEL);
    expect(resolveModel(null)).toBe(DEFAULT_MODEL);
    expect(resolveModel(undefined)).toBe(DEFAULT_MODEL);
  });

  it('resolveModel honours a valid fallback but ignores an invalid one', () => {
    const fb = AVAILABLE_MODELS[2].id;
    expect(resolveModel('bad/model', fb)).toBe(fb);
    expect(resolveModel('bad/model', 'also-bad')).toBe(DEFAULT_MODEL);
  });

  it('isAllowedModel guards ids correctly', () => {
    expect(isAllowedModel(DEFAULT_MODEL)).toBe(true);
    expect(isAllowedModel('nope')).toBe(false);
    expect(isAllowedModel(42)).toBe(false);
  });
});
