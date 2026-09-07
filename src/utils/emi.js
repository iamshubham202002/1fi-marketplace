/**
 * Standard reducing-balance EMI formula:
 *   E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where r is the monthly interest rate and n is the tenure in months.
 * When the annual rate is 0 (no-cost EMI), this collapses to P / n.
 */
export function calculateMonthlyEmi(principal, tenureMonths, annualInterestRatePct = 0) {
  if (!principal || !tenureMonths) return 0;
  if (!annualInterestRatePct) {
    return Math.round(principal / tenureMonths);
  }
  const r = annualInterestRatePct / 12 / 100;
  const factor = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

export function buildEmiPlans(planTemplates, principal) {
  return planTemplates.map((plan) => {
    const monthlyEmi = calculateMonthlyEmi(principal, plan.tenureMonths, plan.interestRate);
    const totalAmount = monthlyEmi * plan.tenureMonths + (plan.processingFee || 0);
    return {
      ...plan,
      monthlyEmi,
      totalAmount,
      interestPayable: Math.max(totalAmount - principal - (plan.processingFee || 0), 0),
    };
  });
}
