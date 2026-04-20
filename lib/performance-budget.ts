export const PERFORMANCE_BUDGET = {
  lcp: 2500,
  fcp: 1800,
  cls: 0.1,
  ttfb: 800,
} as const;

export type MetricName = keyof typeof PERFORMANCE_BUDGET;

export function isMetricOverBudget(name: MetricName, value: number): boolean {
  return value > PERFORMANCE_BUDGET[name];
}
