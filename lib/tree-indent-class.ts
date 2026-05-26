/**
 * Tailwind arbitrary padding-left for nested sidebar/document tree rows.
 * Replaces inline `style={{ paddingLeft }}` — see noted/no-inline-style guardrail.
 */

export function getTreeIndentClass(
  level: number | undefined,
  basePaddingPx: number,
  omitWhenFalsy = false,
): string | undefined {
  if (!level) {
    return omitWhenFalsy ? undefined : `pl-[${basePaddingPx}px]`;
  }

  return `pl-[${level * 12 + basePaddingPx}px]`;
}
