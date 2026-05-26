import { getTreeIndentClass } from "@/lib/tree-indent-class";

describe("getTreeIndentClass", () => {
  it("returns base padding when level is undefined", () => {
    expect(getTreeIndentClass(undefined, 12)).toBe("pl-[12px]");
  });

  it("returns base padding when level is 0", () => {
    expect(getTreeIndentClass(0, 12)).toBe("pl-[12px]");
  });

  it("adds 12px per nesting level to the base padding", () => {
    expect(getTreeIndentClass(2, 25)).toBe("pl-[49px]");
  });

  it("returns undefined when omitWhenFalsy and level is falsy", () => {
    expect(getTreeIndentClass(undefined, 25, true)).toBeUndefined();
    expect(getTreeIndentClass(0, 25, true)).toBeUndefined();
  });
});
