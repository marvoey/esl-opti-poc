import { getOrCreateClientVuid } from './vuid';
import type { ClientOdpEvent } from './events';

type EventBody<T extends ClientOdpEvent> = Pick<T, 'type' | 'action' | 'data'>;

/**
 * Posts anonymous events to the server proxy, tagging each with this browser's vuid.
 * Resolves true when ODP accepted them. Client-only.
 */
export async function trackEvents(events: EventBody<ClientOdpEvent>[]): Promise<boolean> {
  const vuid = getOrCreateClientVuid();
  try {
    const response = await fetch('/api/odp/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events.map((event) => ({ ...event, identifiers: { vuid } }))),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const pageviewEvent = (page_path: string, page_title: string) =>
  ({ type: 'navigation', action: 'pageview', data: { page_path, page_title } }) as const;

export const loanCalculatorEvent = (data: {
  borrow_amount: number;
  loan_term_months: number;
  interest_rate: number;
  calculated_monthly_payment: number;
}) => ({ type: 'loan_calculator', action: 'calculate', data: { loan_type: 'auto_loan', ...data } }) as const;
