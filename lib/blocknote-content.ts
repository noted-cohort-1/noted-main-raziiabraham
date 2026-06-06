export interface BlockNoteInlineContent {
  text?: string;
  type?: string;
}

export interface BlockNoteBlock {
  type: string;
  content?: BlockNoteInlineContent[] | string;
  children?: BlockNoteBlock[];
}

const DEFAULT_AGENT_DESCRIPTION =
  "Write or Ask AI to write a short description about this AI Squad agent. This will be displayed in the card.";

export function parseBlockNoteContent(
  content: string,
): BlockNoteBlock[] | null {
  try {
    const blocks = JSON.parse(content) as BlockNoteBlock[];
    return Array.isArray(blocks) ? blocks : null;
  } catch {
    return null;
  }
}

export function extractAgentDescriptionFromContent(
  content: string,
  fallback: string,
): string {
  const blocks = parseBlockNoteContent(content);
  if (!blocks) {
    return fallback;
  }

  const summaryIdx = blocks.findIndex((block) => {
    if (block.type !== "heading" || !Array.isArray(block.content)) {
      return false;
    }
    return block.content[0]?.text?.toLowerCase().trim() === "summary";
  });

  if (summaryIdx === -1 || blocks.length <= summaryIdx + 1) {
    return fallback;
  }

  const paragraph = blocks[summaryIdx + 1];
  if (paragraph.type !== "paragraph" || !Array.isArray(paragraph.content)) {
    return fallback;
  }

  const rawText = paragraph.content.map((inline) => inline.text ?? "").join("");

  if (!rawText || rawText.trim() === DEFAULT_AGENT_DESCRIPTION) {
    return fallback;
  }

  return rawText;
}

/** Extract plain text from BlockNote JSON content. */
export function extractTextFromBlocks(content: string): string {
  const blocks = parseBlockNoteContent(content);
  if (!blocks) {
    return content;
  }

  let text = "";

  const processBlock = (block: BlockNoteBlock) => {
    if (Array.isArray(block.content)) {
      block.content.forEach((item) => {
        if (typeof item === "string") {
          text += item;
        } else if (item.text) {
          text += item.text;
        }
      });
    } else if (typeof block.content === "string") {
      text += block.content;
    }

    text += "\n";
    block.children?.forEach(processBlock);
  };

  blocks.forEach(processBlock);
  return text;
}
