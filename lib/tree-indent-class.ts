/**
 * Tailwind arbitrary padding-left for nested sidebar/document tree rows.
 * Keep the class strings literal so Tailwind can statically detect and emit them.
 */

const TREE_INDENT_CLASSES = {
  12: [
    "pl-[12px]",
    "pl-[24px]",
    "pl-[36px]",
    "pl-[48px]",
    "pl-[60px]",
    "pl-[72px]",
    "pl-[84px]",
    "pl-[96px]",
    "pl-[108px]",
    "pl-[120px]",
    "pl-[132px]",
    "pl-[144px]",
    "pl-[156px]",
    "pl-[168px]",
    "pl-[180px]",
    "pl-[192px]",
    "pl-[204px]",
    "pl-[216px]",
    "pl-[228px]",
    "pl-[240px]",
    "pl-[252px]",
    "pl-[264px]",
    "pl-[276px]",
    "pl-[288px]",
    "pl-[300px]",
    "pl-[312px]",
    "pl-[324px]",
    "pl-[336px]",
    "pl-[348px]",
    "pl-[360px]",
    "pl-[372px]",
    "pl-[384px]",
    "pl-[396px]",
  ],
  25: [
    "pl-[25px]",
    "pl-[37px]",
    "pl-[49px]",
    "pl-[61px]",
    "pl-[73px]",
    "pl-[85px]",
    "pl-[97px]",
    "pl-[109px]",
    "pl-[121px]",
    "pl-[133px]",
    "pl-[145px]",
    "pl-[157px]",
    "pl-[169px]",
    "pl-[181px]",
    "pl-[193px]",
    "pl-[205px]",
    "pl-[217px]",
    "pl-[229px]",
    "pl-[241px]",
    "pl-[253px]",
    "pl-[265px]",
    "pl-[277px]",
    "pl-[289px]",
    "pl-[301px]",
    "pl-[313px]",
    "pl-[325px]",
    "pl-[337px]",
    "pl-[349px]",
    "pl-[361px]",
    "pl-[373px]",
    "pl-[385px]",
    "pl-[397px]",
    "pl-[409px]",
  ],
} as const;

export function getTreeIndentClass(
  level: number | undefined,
  basePaddingPx: number,
  omitWhenFalsy = false,
): string | undefined {
  const classes = TREE_INDENT_CLASSES[basePaddingPx as 12 | 25];
  if (!classes) {
    return undefined;
  }

  if (!level) {
    return omitWhenFalsy ? undefined : classes[0];
  }

  return classes[Math.min(level, classes.length - 1)];
}
