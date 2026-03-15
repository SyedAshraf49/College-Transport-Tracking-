
/**
 * A simple utility for conditionally joining class names together.
 * In a full shadcn/ui setup, this would typically use `clsx` and `tailwind-merge`.
 * @param inputs The class names to combine.
 * @returns A string of combined class names.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}
