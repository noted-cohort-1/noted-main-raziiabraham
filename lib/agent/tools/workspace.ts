import { tool } from "ai";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Type for document from getById query
interface DocumentResult {
    _id: Id<"documents">;
    title: string;
    content?: string;
    icon?: string;
    isPublished: boolean;
}

// Type for search results
interface SearchDocument {
    _id: Id<"documents">;
    title: string;
    content?: string;
}

// Type for sidebar documents
interface SidebarDocument {
    _id: Id<"documents">;
    title: string;
    icon?: string;
}

/**
 * Convert Markdown content to BlockNote JSON format
 * This creates a simple but valid BlockNote document structure
 */
function markdownToBlockNoteJson(markdown: string): string {
    const blocks: any[] = [];
    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
            i++;
            continue;
        }

        // Heading detection
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const headingText = headingMatch[2];
            // Enforce minimum heading level 2 (downgrade H1 to H2) as H1 is too large
            const adjustedLevel = Math.max(level, 2);
            blocks.push({
                type: "heading",
                props: { level: Math.min(adjustedLevel, 3) as 1 | 2 | 3 },
                content: parseInlineFormatting(headingText),
                children: []
            });
            i++;
            continue;
        }

        // Bullet list item
        if (trimmedLine.match(/^[-*+]\s+/)) {
            const listText = trimmedLine.replace(/^[-*+]\s+/, '');
            blocks.push({
                type: "bulletListItem",
                content: parseInlineFormatting(listText),
                children: []
            });
            i++;
            continue;
        }

        // Numbered list item
        const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
        if (numberedMatch) {
            blocks.push({
                type: "numberedListItem",
                content: parseInlineFormatting(numberedMatch[1]),
                children: []
            });
            i++;
            continue;
        }

        // Code block
        if (trimmedLine.startsWith('```')) {
            const lang = trimmedLine.slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push({
                type: "codeBlock",
                props: { language: lang || "text" },
                content: [{ type: "text", text: codeLines.join('\n'), styles: {} }],
                children: []
            });
            i++; // Skip closing ```
            continue;
        }

        // Regular paragraph - handle inline formatting
        const content = parseInlineFormatting(trimmedLine);
        blocks.push({
            type: "paragraph",
            content,
            children: []
        });
        i++;
    }

    // Ensure at least one block exists
    if (blocks.length === 0) {
        blocks.push({
            type: "paragraph",
            content: [],
            children: []
        });
    }

    return JSON.stringify(blocks);
}

/**
 * Parse inline Markdown formatting (bold, italic) and create BlockNote styled text nodes
 */
function parseInlineFormatting(text: string): any[] {
    const content: any[] = [];

    // Regex to match bold (**text**) and italic (*text* or _text_)
    // Process the text character by character, building styled segments
    let remaining = text;

    while (remaining.length > 0) {
        // Check for bold (**text**)
        const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
            content.push({
                type: "text",
                text: boldMatch[1],
                styles: { bold: true }
            });
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        // Check for bold (__text__)
        const boldMatch2 = remaining.match(/^__(.+?)__/);
        if (boldMatch2) {
            content.push({
                type: "text",
                text: boldMatch2[1],
                styles: { bold: true }
            });
            remaining = remaining.slice(boldMatch2[0].length);
            continue;
        }

        // Check for italic (*text*) - but not **
        const italicMatch = remaining.match(/^\*([^*]+?)\*/);
        if (italicMatch) {
            content.push({
                type: "text",
                text: italicMatch[1],
                styles: { italic: true }
            });
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }

        // Check for italic (_text_) - but not __
        const italicMatch2 = remaining.match(/^_([^_]+?)_/);
        if (italicMatch2) {
            content.push({
                type: "text",
                text: italicMatch2[1],
                styles: { italic: true }
            });
            remaining = remaining.slice(italicMatch2[0].length);
            continue;
        }

        // Check for inline code (`text`)
        const codeMatch = remaining.match(/^`([^`]+?)`/);
        if (codeMatch) {
            content.push({
                type: "text",
                text: codeMatch[1],
                styles: { code: true }
            });
            remaining = remaining.slice(codeMatch[0].length);
            continue;
        }

        // Find the next special character or end of string
        const nextSpecial = remaining.search(/[\*_`]/);
        if (nextSpecial === -1) {
            // No more special characters, add the rest as plain text
            content.push({
                type: "text",
                text: remaining,
                styles: {}
            });
            break;
        } else if (nextSpecial === 0) {
            // Special character at start but didn't match a pattern, treat as literal
            content.push({
                type: "text",
                text: remaining[0],
                styles: {}
            });
            remaining = remaining.slice(1);
        } else {
            // Add text up to the special character
            content.push({
                type: "text",
                text: remaining.slice(0, nextSpecial),
                styles: {}
            });
            remaining = remaining.slice(nextSpecial);
        }
    }

    // If no content was generated, return empty array
    if (content.length === 0) {
        return [];
    }

    return content;
}

/**
 * Create workspace tools for the AI agent
 * Uses the AI SDK `tool()` helper with `inputSchema` format
 */
export function createWorkspaceTools(convexClient: ConvexHttpClient) {
    return {
        readDocument: tool({
            description: "Read the content of a document in the workspace by its ID",
            inputSchema: z.object({
                documentId: z.string().describe("The ID of the document to read"),
            }),
            execute: async ({ documentId }) => {
                console.log(`[Tool Exec] readDocument called with documentId: ${documentId}`);
                try {
                    const doc = await convexClient.query(api.documents.getById, {
                        documentId: documentId as Id<"documents">,
                    }) as DocumentResult | null;

                    if (!doc) {
                        return { error: "Document not found" };
                    }

                    console.log(`[Tool Result] readDocument completed`);
                    return {
                        id: doc._id,
                        title: doc.title,
                        content: doc.content || "(empty document)",
                        icon: doc.icon,
                        isPublished: doc.isPublished,
                    };
                } catch (error) {
                    return { error: `Failed to read document: ${error}` };
                }
            },
        }),

        writeDocument: tool({
            description: "Create a new document in the workspace. Use Markdown for content formatting.",
            inputSchema: z.object({
                title: z.string().describe("Title of the new document"),
                content: z.string().optional().describe("Document content in Markdown format. Use # for headings, - for lists, **bold**, etc."),
                icon: z.string().optional().describe("Document icon - either an emoji (e.g. '📝') or leave empty"),
                parentId: z.string().optional().describe("Parent document ID for nesting"),
            }),
            execute: async ({ title, content, icon, parentId }) => {
                console.log(`[Tool Exec] writeDocument called with title: ${title}`);
                try {
                    const finalParentId = parentId as Id<"documents"> | undefined;
                    const docId = await convexClient.mutation(api.documents.create, {
                        title,
                        parentDocument: finalParentId,
                    });

                    // Update document with content and icon if provided
                    const updatePayload: { id: Id<"documents">; content?: string; icon?: string } = {
                        id: docId,
                    };

                    if (content) {
                        // Convert Markdown to BlockNote JSON format
                        updatePayload.content = markdownToBlockNoteJson(content);
                    }

                    if (icon) {
                        updatePayload.icon = icon;
                    }

                    if (content || icon) {
                        await convexClient.mutation(api.documents.update, updatePayload);
                    }

                    console.log(`[Tool Result] writeDocument completed`);
                    return {
                        success: true,
                        documentId: docId,
                        message: `Created document "${title}"`
                    };
                } catch (error) {
                    return { error: `Failed to create document: ${error}` };
                }
            },
        }),

        editDocument: tool({
            description: "Edit/update an existing document. Use Markdown for content formatting.",
            inputSchema: z.object({
                documentId: z.string().describe("The ID of the document to edit"),
                title: z.string().optional().describe("New title (if changing)"),
                content: z.string().optional().describe("New content in Markdown format. Use # for headings, - for lists, **bold**, etc."),
                icon: z.string().optional().describe("New icon - either an emoji (e.g. '📝') or leave empty"),
            }),
            execute: async ({ documentId, title, content, icon }) => {
                console.log(`[Tool Exec] editDocument called with documentId: ${documentId}`);
                try {
                    const updatePayload: { id: Id<"documents">; title?: string; content?: string; icon?: string } = {
                        id: documentId as Id<"documents">,
                    };

                    if (title) {
                        updatePayload.title = title;
                    }

                    if (content) {
                        // Convert Markdown to BlockNote JSON format
                        updatePayload.content = markdownToBlockNoteJson(content);
                    }

                    if (icon) {
                        updatePayload.icon = icon;
                    }

                    await convexClient.mutation(api.documents.update, updatePayload);

                    console.log(`[Tool Result] editDocument completed`);
                    return {
                        success: true,
                        documentId,
                        message: "Document updated successfully"
                    };
                } catch (error) {
                    return { error: `Failed to edit document: ${error}` };
                }
            },
        }),

        searchWorkspace: tool({
            description: "Search for documents in the workspace by title",
            inputSchema: z.object({
                query: z.string().describe("Search query to match against document titles"),
            }),
            execute: async ({ query }) => {
                console.log(`[Tool Exec] searchWorkspace called with query: ${query}`);
                try {
                    const documents = await convexClient.query(api.documents.getSearch, {}) as SearchDocument[];

                    const queryLower = query.toLowerCase();
                    const results = documents
                        .filter((doc) => doc.title.toLowerCase().includes(queryLower))
                        .slice(0, 10)
                        .map((doc) => ({
                            id: doc._id,
                            title: doc.title,
                            preview: doc.content?.substring(0, 200) || "(no content)",
                        }));

                    console.log(`[Tool Result] searchWorkspace completed with ${results.length} results`);
                    return {
                        count: results.length,
                        results,
                    };
                } catch (error) {
                    return { error: `Failed to search workspace: ${error}` };
                }
            },
        }),

        listDocuments: tool({
            description: "List all documents in the workspace or under a specific parent",
            inputSchema: z.object({
                parentId: z.string().optional().describe("Parent document ID to list children of (leave empty for root)"),
            }),
            execute: async ({ parentId }) => {
                console.log(`[Tool Exec] listDocuments called with parentId: ${parentId || "root"}`);
                try {
                    const documents = await convexClient.query(api.documents.getSidebar, {
                        parentDocument: parentId as Id<"documents"> | undefined,
                    }) as SidebarDocument[];

                    console.log(`[Tool Result] listDocuments completed with ${documents.length} documents`);
                    return {
                        count: documents.length,
                        documents: documents.map((doc) => ({
                            id: doc._id,
                            title: doc.title,
                            icon: doc.icon,
                        })),
                    };
                } catch (error) {
                    return { error: `Failed to list documents: ${error}` };
                }
            },
        }),
    };
}
