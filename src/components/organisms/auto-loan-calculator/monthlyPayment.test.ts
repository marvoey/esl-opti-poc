import { describe, it, expect } from 'vitest';
import { monthlyPayment } from './monthlyPayment';

describe('monthlyPayment', () => {
  it('matches the demo preset: $32,000 over 60 months at 5.49%', () => {
    expect(monthlyPayment(32000, 5.49, 60)).toBe(611.09);
  });

  it('splits evenly at 0% APR', () => {
    expect(monthlyPayment(12000, 0, 48)).toBe(250);
  });
});
