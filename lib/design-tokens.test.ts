import {
  BRAND_BLUE_HEX,
  BRAND_BLUE_SURFACE_HEX,
} from "@/lib/design-tokens";

describe("design-tokens", () => {
  it("exports valid hex colors for third-party APIs", () => {
    expect(BRAND_BLUE_HEX).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(BRAND_BLUE_SURFACE_HEX).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
