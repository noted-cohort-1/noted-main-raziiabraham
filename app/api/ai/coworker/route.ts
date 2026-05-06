import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, LanguageModel, stepCountIs, tool, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { z } from "zod";
import { NextRequest } from "next/server";
import { createWorkspaceTools } from "@/lib/agent/tools/workspace";
import { buildSystemPrompt } from "@/lib/agent/prompts/squad-prompts";
import { Id } from "@/convex/_generated/dataModel";

export const runtime = "edge";

// Allow streaming responses up to 300 seconds (Relevance agents can run for several minutes)
export const maxDuration = 300;

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
        const { messages, agentId, agentSource, agentDisplayName } = requestBody;

        console.log("[coworker/route] Request body keys:", Object.keys(requestBody));
        console.log("[coworker/route] agentId:", agentId, "| agentSource:", agentSource, "| agentDisplayName:", agentDisplayName);

        if (!Array.isArray(messages)) {
            return Response.json({ error: "Messages array is required" }, { status: 400 });
        }

        // Initialize Convex client with auth
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        convex.setAuth(token);

        // --- RESOLVE AGENT & SYSTEM PROMPT ---
        let instructionContent = "";
        let agentName = "AI Squad";
        const isRelevanceAgent = agentSource === "relevance";

        if (isRelevanceAgent && agentId) {
            // Relevance AI agent — skip Convex query, go straight to execution block
            agentName = agentDisplayName || "Relevance Agent";
        } else if (agentId) {
            // Load specific Noted squad agent
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
                console.error("Failed to load squad agent:", e);
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

        // --- ENFORCE RELEVANCE AGENT VIA TOOL CALLING ---
        let dynamicTools: any = { ...tools };
        let finalSystemPrompt = systemPrompt;

        // Shared writer reference — will be set by createUIMessageStream
        // and used by the tool's execute function to inject live progress chunks
        let sharedWriter: any = null;

        if (isRelevanceAgent && agentId) {
            finalSystemPrompt = `You are a coordinator for the "${agentName}" agent. 
The user wants to interact with this specific agent. 
You MUST immediately use the \`invoke_relevance_agent\` tool to forward the user's exact request to the agent.
You are the interface. The user is talking to you, but you rely ENTIRELY on the \`invoke_relevance_agent\` tool to get the actual work done or questions answered by the specialized agent.
The tool will return both a "Process Log" representing what the agent did, and a "Final Result". 

CRITICAL INSTRUCTIONS:
1. Always call invoke_relevance_agent for the user's latest request. Wait for the result.
2. When the result returns, provide a brief 2-3 sentence summary of what the agent found or did.
3. If the user asked you to write a report, document, or save the output, use the workspace tools to create the document. In chat, only confirm that the document was created and give a short summary — do NOT paste the full report content into the chat message.
4. Keep your chat responses concise and actionable. The user can read the full details in the document you created.`;

            const lastMsg = messages[messages.length - 1];
            const userMsg = lastMsg?.parts
                ?.filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('') || lastMsg?.content || "";

            // Extract the previous taskId from the message history if it exists
            let previousTaskId = undefined;
            for (let i = messages.length - 1; i >= 0; i--) {
                const msg = messages[i];
                if (msg.role === 'assistant') {
                    const contentStr = msg.parts ? msg.parts.map((p: any) => p.text).join('') : msg.content;
                    const match = contentStr?.match(/<!-- _relevance_task_id: (.*?) -->/);
                    if (match) {
                        previousTaskId = match[1];
                        break;
                    }
                }
            }

            console.log("[relevance-tool] found previousTaskId:", previousTaskId);

            dynamicTools = {
                ...tools,
                invoke_relevance_agent: tool({
                    description: `REQUIRED: Call the ${agentName} agent to get specific information or perform tasks on behalf of the user.`,
                    inputSchema: z.object({
                        request: z.string().describe("The user's exact original request, question, or follow-up response.")
                    }),
                    execute: async ({ request }) => {
                        console.log(`[relevance-tool] Invoking ${agentName} with:`, request);

                        try {
                            const trigger = await convex.action(
                                (api as any).aiSettingsActions.triggerRelevanceAgent,
                                { agentId, message: request || userMsg, taskId: previousTaskId }
                            );

                            console.log("[relevance-tool] trigger result:", JSON.stringify(trigger));

                            const taskId = trigger.taskId;
                            let status = trigger.status;
                            let output = "";
                            let stepsHistory: any[] = [];
                            const seenStepIds = new Set<string>();
                            // Track which steps are currently "running" so we can mark them finished
                            const activeStepIds = new Set<string>();
                            let attempts = 0;
                            const maxAttempts = 90; // ~3 minutes (90 attempts × 2s)

                            if (!taskId) {
                                throw new Error("Trigger returned no taskId. Full response: " + JSON.stringify(trigger));
                            }

                            while (status !== "completed" && attempts < maxAttempts) {
                                attempts++;
                                await new Promise(r => setTimeout(r, 2000));

                                const freshToken = await getToken({ template: "convex" });
                                if (freshToken) {
                                    convex.setAuth(freshToken);
                                }

                                const poll = await convex.action(
                                    (api as any).aiSettingsActions.pollRelevanceAgentResult,
                                    { agentId, taskId }
                                );

                                console.log(`[relevance-tool] poll #${attempts}:`, JSON.stringify(poll));

                                // Stream each step as a tool-call-like chunk in the UI
                                if (poll.steps && sharedWriter) {
                                    stepsHistory = poll.steps;
                                    for (const step of poll.steps) {
                                        const stepToolCallId = `relevance-step-${step.id}`;

                                        if (!seenStepIds.has(step.id)) {
                                            // New step — emit tool-input-start (shows spinner + name)
                                            seenStepIds.add(step.id);
                                            activeStepIds.add(step.id);
                                            try {
                                                sharedWriter.write({
                                                    type: 'tool-input-start',
                                                    toolCallId: stepToolCallId,
                                                    toolName: step.title,
                                                });
                                            } catch (e) { /* ignore */ }
                                        }

                                        if (step.state === 'finished' && activeStepIds.has(step.id)) {
                                            // Step finished — emit tool-output-available (removes spinner)
                                            activeStepIds.delete(step.id);
                                            try {
                                                sharedWriter.write({
                                                    type: 'tool-output-available',
                                                    toolCallId: stepToolCallId,
                                                    output: 'completed',
                                                });
                                            } catch (e) { /* ignore */ }
                                        }
                                    }
                                }

                                status = poll.status;
                                if (status === "completed") {
                                    output = poll.output || "Agent completed but returned no message.";
                                    break;
                                }

                                if (status === "error") {
                                    throw new Error(poll.output || "Relevance agent encountered an error.");
                                }
                            }

                            // Mark any remaining active steps as finished
                            if (sharedWriter) {
                                for (const stepId of activeStepIds) {
                                    try {
                                        sharedWriter.write({
                                            type: 'tool-output-available',
                                            toolCallId: `relevance-step-${stepId}`,
                                            output: 'completed',
                                        });
                                    } catch (e) { /* ignore */ }
                                }
                            }

                            if (status !== "completed") {
                                throw new Error("Agent timed out. Check your Relevance AI dashboard for results.");
                            }

                            // Format the output to include the steps taken
                            let formattedOutput = `**Process Log:**\n`;
                            stepsHistory.forEach(step => {
                                formattedOutput += `- [${step.state.toUpperCase()}] ${step.title}\n`;
                            });

                            formattedOutput += `\n**Final Result:**\n${output}`;
                            formattedOutput += `\n\n<!-- _relevance_task_id: ${taskId} -->`;

                            return formattedOutput;
                        } catch (error: any) {
                            console.error("[relevance-tool] Error:", error.message || error);
                            return `Error invoking agent: ${error.message || String(error)}`;
                        }
                    }
                })
            };
        }

        // --- EXECUTE AGENT LOOP ---
        if (isRelevanceAgent && agentId) {
            // Use createUIMessageStream to allow live progress injection from the tool
            const stream = createUIMessageStream({
                execute: async ({ writer }) => {
                    // Share the writer with the tool's execute function via closure
                    sharedWriter = writer;

                    const result = streamText({
                        model,
                        system: finalSystemPrompt,
                        messages: formattedMessages,
                        tools: dynamicTools as any,
                        stopWhen: stepCountIs(10),
                        ...(providerOptions && { providerOptions }),
                    });

                    // Merge the AI model's stream — keep model reasoning visible
                    writer.merge(result.toUIMessageStream({
                        sendReasoning: true,
                    }));
                },
                onError: (error) => {
                    console.error("[createUIMessageStream] Error:", error);
                    return String(error);
                },
            });

            return createUIMessageStreamResponse({ stream });
        }

        // Non-Relevance agent: standard streamText flow
        const result = streamText({
            model,
            system: finalSystemPrompt,
            messages: formattedMessages,
            tools: dynamicTools as any,
            stopWhen: stepCountIs(10),
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
