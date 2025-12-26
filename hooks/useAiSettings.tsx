import { create } from "zustand";
import { toast } from "sonner";

type Model = {
  id: string;
  created: number;
};

type AiSettingsStore = {
  isOpen: boolean;
  isLoading: boolean;
  isTesting: boolean;
  isFetchingModels: boolean;
  apiKey: string;
  selectedModel: string | null;
  availableModels: Model[];
  onOpen: () => void;
  onClose: () => void;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setAvailableModels: (models: Model[]) => void;
  setIsTesting: (testing: boolean) => void;
  setIsFetchingModels: (fetching: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useAiSettings = create<AiSettingsStore>((set) => ({
  isOpen: false,
  isLoading: false,
  isTesting: false,
  isFetchingModels: false,
  apiKey: "",
  selectedModel: null,
  availableModels: [],

  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({
      isOpen: false,
      apiKey: "",
      selectedModel: null,
      availableModels: [],
    });
  },

  setApiKey: (key: string) => set({ apiKey: key }),
  setSelectedModel: (model: string) => set({ selectedModel: model }),
  setAvailableModels: (models: Model[]) => set({ availableModels: models }),
  setIsTesting: (testing: boolean) => set({ isTesting: testing }),
  setIsFetchingModels: (fetching: boolean) =>
    set({ isFetchingModels: fetching }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  reset: () => {
    set({
      apiKey: "",
      selectedModel: null,
      availableModels: [],
      isLoading: false,
      isTesting: false,
      isFetchingModels: false,
    });
  },
}));

