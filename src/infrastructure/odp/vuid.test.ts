import { describe, it, expect } from 'vitest';
import { demoVuid, isValidVuid, normalizeVuid, parseVuid } from './vuid';

describe('normalizeVuid', () => {
  it('keeps a plain id', () => {
    expect(normalizeVuid('vuid_esl_abcdef123456')).toBe('vuid_esl_abcdef123456');
  });

  it('takes the id before the pipe of an ODP-style cookie', () => {
    expect(normalizeVuid('a1b2c3d4e5f60718293a4b5c6d7e8f90|1790000000')).toBe('a1b2c3d4e5f60718293a4b5c6d7e8f90');
    expect(normalizeVuid('a1b2c3d4e5f60718293a4b5c6d7e8f90%7C1790000000')).toBe('a1b2c3d4e5f60718293a4b5c6d7e8f90');
  });

  it('rejects missing or unusable values', () => {
    expect(normalizeVuid(undefined)).toBeNull();
    expect(normalizeVuid('')).toBeNull();
    expect(normalizeVuid('not valid!')).toBeNull();
  });
});

describe('parseVuid', () => {
  it('finds the cookie among others', () => {
    expect(parseVuid('a=1; vuid=vuid_esl_abcdef123456; b=2')).toBe('vuid_esl_abcdef123456');
  });
});

describe('vuid length', () => {
  it('rejects ids longer than the 32 characters ODP stores', () => {
    expect(normalizeVuid('vuid_esl_97e3f4222f014c1788f34b37baad91c7')).toBeNull();
    expect(normalizeVuid('97e3f4222f014c1788f34b37baad91c7')).toBe('97e3f4222f014c1788f34b37baad91c7');
  });
});

describe('demoVuid', () => {
  it('is built from the local month, day and hour', () => {
    expect(demoVuid(new Date(2026, 9, 23, 14, 30))).toBe('vuid_esl_live_demo_10_23_14');
    expect(demoVuid(new Date(2026, 0, 5, 0, 0))).toBe('vuid_esl_live_demo_1_5_0');
  });

  it('always fits the 32 characters ODP stores', () => {
    expect(isValidVuid(demoVuid(new Date(2026, 11, 31, 23)))).toBe(true);
  });
});
