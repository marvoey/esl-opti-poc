/** Fixed-rate amortized payment, rounded to cents. Same formula as the calculator component. */
export function monthlyPayment(principal, annualRatePercent, termMonths) {
  const rate = annualRatePercent / 100 / 12;
  const payment =
    rate === 0
      ? principal / termMonths
      : (principal * rate * (1 + rate) ** termMonths) / ((1 + rate) ** termMonths - 1);
  return Math.round(payment * 100) / 100;
}
