const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return inrFormatter.format(value);
}
