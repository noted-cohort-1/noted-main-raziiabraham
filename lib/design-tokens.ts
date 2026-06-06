/**
 * Hex literals for third-party APIs that reject CSS variables (BlockNote cursor, etc.).
 * For JSX styling, use Tailwind tokens from app/globals.css — never import these in className.
 *
 * @see DESIGN.md brand-blue tokens
 * @see .ai/skills/eslint-self-heal/SKILL.md — "API requires hex"
 */

/** DESIGN.md brand-blue — AI affordances and agent cursor */
export const BRAND_BLUE_HEX = "#2563EB";

/** DESIGN.md brand-blue dark surface — lighter cursor on dark editor chrome */
export const BRAND_BLUE_SURFACE_HEX = "#60A5FA";
