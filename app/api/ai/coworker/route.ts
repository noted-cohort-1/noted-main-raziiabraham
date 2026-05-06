import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, LanguageModel, stepCountIs } from "ai";
import { NextRequest } from "next/server";
import { createWorkspaceTools } from "@/lib/agent/tools/workspace";
import { buildSystemPrompt } from "@/lib/agent/prompts/squad-prompts";
import { Id } from "@/convex/_generated/dataModel";

// Allow streaming responses up to 60 seconds (agent may take longer)
export const maxDuration = 60;

// Message type for API
interface ChatMessage {
    role: "user" | "assistant";
    content?: string;
    parts?: any[];
}

// Block type from BlockNote
interface Block {
    type: string;
    content?: string | any[];
    children?: Block[];
}

/**
 * Create the appropriate AI model based on provider
 * For Google Gemini 2.5+ models, this includes thinkingConfig with includeThoughts
 */
function createAIModel(provider: string, apiKey: string, modelId: string): LanguageModel {
    switch (provider) {
        case "google": {
            const google = createGoogleGenerativeAI({ apiKey });
            // Use the model selected by the user in settings
            return google(modelId) as unknown as LanguageModel;
        }
        case "openai": {
            const openai = createOpenAI({ apiKey });
            return openai(modelId) as unknown as LanguageModel;
        }
        case "anthropic": {
            const anthropic = createAnthropic({ apiKey });
            return anthropic(modelId) as unknown as LanguageModel;
        }
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}

/**
 * Get thinkingConfig provider options for Google Gemini models
 * Gemini 3 uses thinkingLevel, Gemini 2.5 uses thinkingBudget
 */
function getGoogleThinkingConfig(modelId: string): Record<string, any> | undefined {
    if (modelId.startsWith("gemini-3")) {
        return {
            google: {
                thinkingConfig: {
                    thinkingLevel: "high",
                    includeThoughts: true,
                },
            },
        };
    } else if (modelId.startsWith("gemini-2.5")) {
        return {
            google: {
                thinkingConfig: {
                    thinkingBudget: 8192,
                    includeThoughts: true,
                },
            },
        };
    }
    return undefined;
}

/**
 * Extract plain text from BlockNote content
 */
function extractTextFromBlocks(content: string): string {
    try {
        const blocks: Block[] = JSON.parse(content);
        let text = "";

        const processBlock = (block: Block) => {
            // Handle text content which can be string or array of styled text objects
            if (Array.isArray(block.content)) {
                block.content.forEach((item) => {
                    if (typeof item === "string") text += item;
                    else if (item.text) text += item.text;
                });
            } else if (typeof block.content === "string") {
                text += block.content;
            }

            text += "\n";

            if (block.children) {
                block.children.forEach(processBlock);
            }
        };

        blocks.forEach(processBlock);
        return text;
    } catch (e) {
        console.error("Failed to parse document content:", e);
        return "";
    }
}

/**
 * Marketing Co-worker Agent API Route
 * 
 * Provides a chat interface with the agent that has access to workspace tools
 */
import { auth } from "@clerk/nextjs/server";

// ... existing imports ...

export async function POST(req: NextRequest) {
    try {
        // Verify authentication using Clerk (works with cookies)
        const { userId, getToken } = await auth();

        if (!userId) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const token = await getToken({ template: "convex" });
        if (!token) {
            return Response.json({ error: "Failed to retrieve authentication token" }, { status: 401 });
        }

        // Parse request
        const requestBody = await req.json();
        const { messages, agentId } = requestBody;

        if (!Array.isArray(messages)) {
            return Response.json({ error: "Messages array is required" }, { status: 400 });
        }

        // Initialize Convex client with auth
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        convex.setAuth(token);

        // --- RESOLVE AGENT & SYSTEM PROMPT ---
        let instructionContent = "";
        let agentName = "AI Squad";

        if (agentId) {
            // Load specific squad agent
            try {
                const agent = await convex.query((api as any).squadAgents.getById, {
                    id: agentId as Id<"squadAgents">
                });

                if (agent) {
                    agentName = agent.name;
                    if (agent.instructionsDocId) {
                        const doc = await convex.query(api.documents.getById, {
                            documentId: agent.instructionsDocId
                        });
                        if (doc?.content) {
                            instructionContent = extractTextFromBlocks(doc.content);
                        }
                    }
                }
            } catch (e) {
                console.warn(`Failed to load squad agent ${agentId}:`, e);
            }
        } else {
            // No specific agent selected - use the general AI Squad identity
            instructionContent = ""; // This triggers the buildSystemPrompt to use DEFAULT_SQUAD_PROMPT
        }

        // Build system prompt (will use default if instructionContent is empty)
        const systemPrompt = buildSystemPrompt(instructionContent);

        // --- GET AI SETTINGS & MODEL ---
        const settings = await convex.action(
            (api as any).aiSettingsActions.getDecryptedApiKey,
            {}
        );

        if (!settings?.apiKey) {
            return Response.json(
                { error: "AI settings not configured. Please add an API key in Settings." },
                { status: 400 }
            );
        }

        const modelId = settings.model || "gemini-2.5-flash";
        const model = createAIModel(settings.provider, settings.apiKey, modelId);
        const providerOptions = settings.provider === "google"
            ? getGoogleThinkingConfig(modelId)
            : undefined;

        // --- PREPARE TOOLS & MESSAGES ---
        const tools = createWorkspaceTools(convex);

        const formattedMessages = messages.map((msg: ChatMessage) => {
            if (msg.parts && Array.isArray(msg.parts)) {
                return {
                    role: msg.role as "user" | "assistant",
                    content: msg.parts.map(part => {
                        if (part.type === 'text') return { type: 'text', text: part.text };
                        if (part.type === 'image') return { type: 'image', image: part.image };
                        if (part.type === 'file') return {
                            type: 'file',
                            data: part.data,
                            mimeType: part.mimeType,
                            mediaType: part.mimeType
                        };
                        return null;
                    }).filter(Boolean) as any
                };
            }

            return {
                role: msg.role as "user" | "assistant",
                content: msg.content || "",
            };
        });

        // --- EXECUTE AGENT LOOP ---
        // Using streamText with stopWhen for agentic behavior (ToolLoopAgent pattern)
        const result = streamText({
            model,
            system: systemPrompt,
            messages: formattedMessages,
            tools: tools as any,
            stopWhen: stepCountIs(5),
            ...(providerOptions && { providerOptions }),
        });

        // @ts-ignore
        return result.toUIMessageStreamResponse({
            sendReasoning: true
        });
    } catch (error) {
        console.error("Coworker API error:", error);
        return Response.json(
            { error: "Failed to process coworker request" },
            { status: 500 }
        );
    }
}
