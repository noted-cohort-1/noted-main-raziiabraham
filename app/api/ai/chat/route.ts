import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText, LanguageModel } from "ai";
import { NextRequest } from "next/server";
import {
  aiDocumentFormats,
  injectDocumentStateMessages,
  toolDefinitionsToToolSet,
} from "@blocknote/xl-ai/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Create the appropriate AI model based on provider
 * Note: Some providers return LanguageModelV3, we cast to LanguageModel for compatibility
 */
function createAIModel(provider: string, apiKey: string, modelId: string): LanguageModel {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai(modelId) as unknown as LanguageModel;
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelId) as unknown as LanguageModel;
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelId) as unknown as LanguageModel;
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * AI Chat API Route for BlockNote editor.
 * Follows the official BlockNote AI backend pattern.
 * 
 * Supports multiple AI providers:
 * - OpenAI (GPT models)
 * - Anthropic (Claude models)  
 * - Google (Gemini models)
 */
import { getProviderFromModelId } from "@/lib/ai-models";

// ... imports remain the same

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Parse request first to identify requested model
    const requestBody = await req.json();
    const { messages, toolDefinitions, model: requestModel } = requestBody;

    if (!Array.isArray(messages)) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Determine which provider we need
    let targetProvider: string | undefined;
    if (requestModel) {
      targetProvider = getProviderFromModelId(requestModel);
    }

    // Get API key from Convex for the specific provider
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const settings = await convex.action(
      (api as any).aiSettingsActions.getDecryptedApiKey,
      targetProvider ? { provider: targetProvider } : {}
    );

    if (!settings?.apiKey) {
      return Response.json({ error: `AI settings not configured for ${targetProvider || "active provider"}` }, { status: 400 });
    }

    // Use refined provider/model from settings
    const provider = settings.provider;
    const modelId = requestModel || settings.model || "gpt-4o-mini";

    // Create the appropriate AI model
    const model = createAIModel(provider, settings.apiKey, modelId);

    // Prepare messages - convertToModelMessages may be async in ai SDK v5
    const injectedMessages = injectDocumentStateMessages(messages);
    const modelMessages = await convertToModelMessages(injectedMessages);

    // Stream response using official BlockNote pattern
    const result = streamText({
      model,
      system: aiDocumentFormats.html.systemPrompt,
      messages: modelMessages,
      // Cast to any to avoid type conflict between different ai SDK versions
      tools: toolDefinitionsToToolSet(toolDefinitions) as any,
      toolChoice: "required",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
