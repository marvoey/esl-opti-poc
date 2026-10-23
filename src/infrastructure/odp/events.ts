import { z } from 'zod';
import { isValidVuid } from './vuid';

/**
 * Events the browser may ask the server to forward to ODP. The proxy route holds the private
 * API key, so it accepts only these exact shapes: an anonymous `vuid`, never an email or any other
 * identifier, and no client-supplied timestamp (the server stamps `ts`).
 */
const Vuid = z.string().refine(isValidVuid);
const AnonymousIdentifiers = z.strictObject({ vuid: Vuid });

const PageviewEvent = z.strictObject({
  type: z.literal('navigation'),
  action: z.literal('pageview'),
  identifiers: AnonymousIdentifiers,
  data: z.strictObject({
    page_path: z.string().max(200).startsWith('/'),
    page_title: z.string().max(200),
  }),
});

const LoanCalculatorEvent = z.strictObject({
  type: z.literal('loan_calculator'),
  action: z.literal('calculate'),
  identifiers: AnonymousIdentifiers,
  data: z.strictObject({
    loan_type: z.literal('auto_loan'),
    borrow_amount: z.number().min(0).max(1_000_000),
    loan_term_months: z.number().int().min(1).max(480),
    interest_rate: z.number().min(0).max(100),
    calculated_monthly_payment: z.number().min(0).max(1_000_000),
  }),
});

export const ClientEventsSchema = z
  .array(z.discriminatedUnion('type', [PageviewEvent, LoanCalculatorEvent]))
  .min(1)
  .max(5);

export type ClientOdpEvent = z.infer<typeof ClientEventsSchema>[number];
