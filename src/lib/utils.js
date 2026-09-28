/**
 * Utility function to merge class names conditionally
 */
export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(' ')
    .trim();
}
