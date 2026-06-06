import { getCoworkerToolDisplayName } from "@/lib/coworker-message-ui";

describe("getCoworkerToolDisplayName", () => {
  it("returns searching label while workspace search is in progress", () => {
    expect(getCoworkerToolDisplayName("searchWorkspace")).toBe("Searching...");
  });

  it("returns result count when workspace search completes", () => {
    expect(
      getCoworkerToolDisplayName("searchWorkspace", { count: 3 }, "result"),
    ).toBe("Found 3 result(s)");
  });
});
