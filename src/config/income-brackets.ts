// Income thresholds are in PPP-adjusted USD (purchasing power parity).
// Raw income is first converted via ppp-factors.ts before bracket lookup.

export interface IncomeBracket {
  maxIncome: number | null; // null = no upper limit
  factor: number;
}

export const incomeBrackets: IncomeBracket[] = [
  { maxIncome: 20_000, factor: 0.7 },
  { maxIncome: 40_000, factor: 0.85 },
  { maxIncome: 70_000, factor: 1.0 },
  { maxIncome: 100_000, factor: 1.1 },
  { maxIncome: null, factor: 1.2 },
];

export function getIncomeFactor(annualIncome: number): number {
  for (const bracket of incomeBrackets) {
    if (bracket.maxIncome === null || annualIncome <= bracket.maxIncome) {
      return bracket.factor;
    }
  }
  return 1.0;
}
