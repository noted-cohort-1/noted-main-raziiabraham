/**
 * Hardcoded AI model configurations from Vercel AI SDK documentation.
 * Models are taken from:
 * - https://ai-sdk.dev/providers/ai-sdk-providers/openai#model-capabilities
 * - https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#model-capabilities
 * - https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#model-capabilities
 */

export type AIProvider = "openai" | "anthropic" | "google";

export interface AIModel {
    id: string;
    name: string;
    provider: AIProvider;
}

export interface AIProviderConfig {
    name: string;
    placeholder: string;
    description: string;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
    openai: {
        name: "OpenAI",
        placeholder: "sk-...",
        description: "GPT models from OpenAI",
    },
    anthropic: {
        name: "Anthropic",
        placeholder: "sk-ant-...",
        description: "Claude models from Anthropic",
    },
    google: {
        name: "Google Gemini",
        placeholder: "AIza...",
        description: "Gemini models from Google",
    },
};

export const AI_MODELS: AIModel[] = [
    // OpenAI Models
    { id: "gpt-5.2-pro", name: "GPT-5.2 Pro", provider: "openai" },
    { id: "gpt-5.2-chat-latest", name: "GPT-5.2 Chat Latest", provider: "openai" },
    { id: "gpt-5.2", name: "GPT-5.2", provider: "openai" },
    { id: "gpt-5.1-codex-mini", name: "GPT-5.1 Codex Mini", provider: "openai" },
    { id: "gpt-5.1-codex", name: "GPT-5.1 Codex", provider: "openai" },
    { id: "gpt-5.1-chat-latest", name: "GPT-5.1 Chat Latest", provider: "openai" },
    { id: "gpt-5.1", name: "GPT-5.1", provider: "openai" },
    { id: "gpt-5-pro", name: "GPT-5 Pro", provider: "openai" },
    { id: "gpt-5", name: "GPT-5", provider: "openai" },
    { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "openai" },
    { id: "gpt-5-nano", name: "GPT-5 Nano", provider: "openai" },
    { id: "gpt-5-codex", name: "GPT-5 Codex", provider: "openai" },
    { id: "gpt-5-chat-latest", name: "GPT-5 Chat Latest", provider: "openai" },
    { id: "gpt-4.1", name: "GPT-4.1", provider: "openai" },
    { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
    { id: "gpt-4.1-nano", name: "GPT-4.1 Nano", provider: "openai" },
    { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },

    // Anthropic Models
    { id: "claude-opus-4-5", name: "Claude Opus 4.5", provider: "anthropic" },
    { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", provider: "anthropic" },
    { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", provider: "anthropic" },
    { id: "claude-opus-4-1", name: "Claude Opus 4.1", provider: "anthropic" },
    { id: "claude-opus-4-0", name: "Claude Opus 4.0", provider: "anthropic" },
    { id: "claude-sonnet-4-0", name: "Claude Sonnet 4.0", provider: "anthropic" },
    { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet Latest", provider: "anthropic" },
    { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku Latest", provider: "anthropic" },

    // Google Gemini Models (Gemini 2.5+ with thinking support)
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview", provider: "google" },
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview", provider: "google" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "google" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "google" },
];

/**
 * Get all models for a specific provider
 */
export const getModelsForProvider = (provider: AIProvider): AIModel[] =>
    AI_MODELS.filter((m) => m.provider === provider);

/**
 * Get the default model for a provider (first model in the list)
 */
export const getDefaultModel = (provider: AIProvider): string => {
    const models = getModelsForProvider(provider);
    return models[0]?.id || "";
};

/**
 * Get a model by its ID
 */
export const getModelById = (id: string): AIModel | undefined =>
    AI_MODELS.find((m) => m.id === id);

/**
 * Get provider from a model ID
 */
export const getProviderFromModelId = (modelId: string): AIProvider | undefined =>
    AI_MODELS.find((m) => m.id === modelId)?.provider;
