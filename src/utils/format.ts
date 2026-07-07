

export function formatPrice(price: number): string {
  return `₦${new Intl.NumberFormat('en-NG').format(price)}`;
}