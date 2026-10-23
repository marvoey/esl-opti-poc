/** Fixed-rate amortized payment, rounded to cents. */
export function monthlyPayment(principal: number, annualRatePercent: number, termMonths: number): number {
  const rate = annualRatePercent / 100 / 12;
  const payment =
    rate === 0
      ? principal / termMonths
      : (principal * rate * (1 + rate) ** termMonths) / ((1 + rate) ** termMonths - 1);
  return Math.round(payment * 100) / 100;
}
