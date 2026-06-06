import {
  extractAgentDescriptionFromContent,
  extractTextFromBlocks,
  parseBlockNoteContent,
} from "@/lib/blocknote-content";

describe("blocknote-content", () => {
  const sampleBlocks = JSON.stringify([
    { type: "heading", content: [{ text: "Summary" }] },
    { type: "paragraph", content: [{ text: "Agent helps with research." }] },
  ]);

  it("parses valid block JSON", () => {
    expect(parseBlockNoteContent(sampleBlocks)).toHaveLength(2);
  });

  it("extracts agent description after Summary heading", () => {
    expect(extractAgentDescriptionFromContent(sampleBlocks, "fallback")).toBe(
      "Agent helps with research.",
    );
  });

  it("extracts plain text from blocks", () => {
    expect(extractTextFromBlocks(sampleBlocks)).toContain(
      "Agent helps with research.",
    );
  });
});
