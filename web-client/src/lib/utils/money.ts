export function formatMoney(
  amountMinor: number | string,
  currency: string
): string {
  const amount = Number(amountMinor);

  const majorAmount = amount / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorAmount);
}
