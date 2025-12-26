import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { NextRequest } from "next/server";
import {
  aiDocumentFormats,
  injectDocumentStateMessages,
  toolDefinitionsToToolSet,
} from "@blocknote/xl-ai/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * AI Chat API Route for BlockNote editor.
 * Follows the official BlockNote AI backend pattern.
 * 
 * Uses:
 * - toolDefinitionsToToolSet: Converts client tool definitions to AI SDK format
 * - injectDocumentStateMessages: Adds document state to messages
 * - aiDocumentFormats.html.systemPrompt: BlockNote's AI system prompt
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Get API key from Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const settings = await convex.action(
      (api as any).aiSettingsActions.getDecryptedApiKey
    );

    if (!settings?.apiKey) {
      return Response.json({ error: "AI settings not configured" }, { status: 400 });
    }

    // Parse request
    const { messages, toolDefinitions } = await req.json();

    if (!Array.isArray(messages)) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Create OpenAI client
    const openai = createOpenAI({ apiKey: settings.apiKey });
    const model = settings.model || "gpt-4o-mini";

    // Stream response using official BlockNote pattern
    const result = streamText({
      model: openai(model),
      system: aiDocumentFormats.html.systemPrompt,
      messages: convertToModelMessages(injectDocumentStateMessages(messages)),
      tools: toolDefinitionsToToolSet(toolDefinitions),
      toolChoice: "required",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
