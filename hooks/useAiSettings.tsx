import { create } from "zustand";
import { AIProvider, getModelsForProvider, getDefaultModel } from "@/lib/ai-models";

type AiSettingsStore = {
  isOpen: boolean;
  isLoading: boolean;
  isTesting: boolean;
  selectedProvider: AIProvider;

  // State for keys input
  apiKey: string;

  // Track which keys are saved
  hasOpenAIKey: boolean;
  hasAnthropicKey: boolean;
  hasGoogleKey: boolean;

  selectedModel: string | null;

  onOpen: () => void;
  onClose: () => void;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setSelectedProvider: (provider: AIProvider) => void;
  setIsTesting: (testing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setHasKey: (provider: AIProvider, hasKey: boolean) => void;
  reset: () => void;
};

export const useAiSettings = create<AiSettingsStore>((set) => ({
  isOpen: false,
  isLoading: false,
  isTesting: false,
  selectedProvider: "openai",
  apiKey: "",
  selectedModel: null,

  hasOpenAIKey: false,
  hasAnthropicKey: false,
  hasGoogleKey: false,

  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({
      isOpen: false,
      apiKey: "",
      selectedModel: null,
    });
  },

  setApiKey: (key: string) => set({ apiKey: key }),
  setSelectedModel: (model: string) => set({ selectedModel: model }),
  setSelectedProvider: (provider: AIProvider) =>
    set({
      selectedProvider: provider,
      // When switching provider, reset the API key input field
      // but keep the key status indicator
      apiKey: "",
      selectedModel: getDefaultModel(provider),
    }),
  setIsTesting: (testing: boolean) => set({ isTesting: testing }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setHasKey: (provider: AIProvider, hasKey: boolean) => {
    if (provider === "openai") set({ hasOpenAIKey: hasKey });
    if (provider === "anthropic") set({ hasAnthropicKey: hasKey });
    if (provider === "google") set({ hasGoogleKey: hasKey });
  },

  reset: () => {
    set({
      apiKey: "",
      selectedModel: null,
      selectedProvider: "openai",
      isLoading: false,
      isTesting: false,
      hasOpenAIKey: false,
      hasAnthropicKey: false,
      hasGoogleKey: false,
    });
  },
}));
