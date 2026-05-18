"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/hooks/use-settings";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useAction, useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ModeToggle } from "../mode-toggle";
import { Loader2, Check, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AI_PROVIDERS,
  AIProvider,
  getModelsForProvider,
  getDefaultModel,
} from "@/lib/ai-models";
import {
  trackAIProviderTested,
  trackAISettingsUpdated,
} from "@/lib/analytics";

const getAIErrorCategory = (error?: string) => {
  if (!error) return "unknown";
  const normalized = error.toLowerCase();

  if (normalized.includes("auth") || normalized.includes("key") || normalized.includes("401")) {
    return "authentication";
  }

  if (normalized.includes("rate") || normalized.includes("quota") || normalized.includes("429")) {
    return "rate_limit";
  }

  if (normalized.includes("network") || normalized.includes("fetch") || normalized.includes("timeout")) {
    return "network";
  }

  if (normalized.includes("provider") || normalized.includes("model")) {
    return "configuration";
  }

  return "provider_error";
};

export const SettingsModal = () => {
  const settings = useSettings();
  const aiSettings = useAiSettings();
  const [activeTab, setActiveTab] = useState<"appearance" | "ai">("appearance");
  const { isAuthenticated } = useConvexAuth();

  const savedSettings = useQuery(
    api.aiSettings.getSettings,
    isAuthenticated ? {} : "skip",
  );
  const testConnection = useAction(api.aiSettingsActions.testConnection);
  const saveSettings = useAction(api.aiSettingsActions.saveSettings);
  const deleteSettings = useMutation(api.aiSettings.deleteSettings);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get models for currently selected provider
  const providerModels = getModelsForProvider(aiSettings.selectedProvider);

  useEffect(() => {
    if (savedSettings && activeTab === "ai") {
      // Sync local state active provider if we haven't selected one yet or first load
      // But we generally want to let user explore providers in the UI without changing active state immediately

      // Update existence flags
      aiSettings.setHasKey("openai", savedSettings.hasOpenAIKey);
      aiSettings.setHasKey("anthropic", savedSettings.hasAnthropicKey);
      aiSettings.setHasKey("google", savedSettings.hasGoogleKey);

      // On first load, set selected provider to active one
      if (!aiSettings.apiKey && !aiSettings.selectedModel) {
        if (savedSettings.provider) {
          aiSettings.setSelectedProvider(savedSettings.provider as AIProvider);
        }
        if (savedSettings.model) {
          aiSettings.setSelectedModel(savedSettings.model);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSettings, activeTab]);

  // Helper to check if current selected provider has a saved key
  const hasSavedKeyForCurrent = () => {
    if (aiSettings.selectedProvider === "openai") return aiSettings.hasOpenAIKey;
    if (aiSettings.selectedProvider === "anthropic") return aiSettings.hasAnthropicKey;
    if (aiSettings.selectedProvider === "google") return aiSettings.hasGoogleKey;
    return false;
  };

  const currentHasKey = hasSavedKeyForCurrent();
  const isActiveProvider = savedSettings?.provider === aiSettings.selectedProvider;

  const handleTestConnection = async () => {
    // If we have a saved key and the input is empty or just dots, we can't really test unless we send a flag to backend 
    // to use saved key. For simplicity, we require entering key to test OR we rely on backend to use saved key if empty?
    // Let's require input for "Test Connection" button to be explicit, or if input is empty but hasSavedKey, verify saved key.

    // Actually our testConnection action requires apiKey string.
    // If user wants to test CURRENTLY SAVED key, we'd need a different action or change testConnection.

    // For now: Only allow testing if user has typed something new. 
    // If they have a saved key, we assume it works (or they can re-enter to test).

    if (!aiSettings.apiKey.trim()) {
      toast.error("Please enter an API key to test");
      return;
    }

    aiSettings.setIsTesting(true);
    try {
      const testResult = await testConnection({
        provider: aiSettings.selectedProvider,
        apiKey: aiSettings.apiKey,
      });

      if (testResult.success) {
        toast.success("Connection successful!");
      } else {
        toast.error(testResult.error || "Connection failed");
      }

      trackAIProviderTested({
        ai_provider: aiSettings.selectedProvider,
        success: testResult.success,
        error_category: testResult.success
          ? undefined
          : getAIErrorCategory(testResult.error),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Connection failed",
      );

      trackAIProviderTested({
        ai_provider: aiSettings.selectedProvider,
        success: false,
        error_category: getAIErrorCategory(
          error instanceof Error ? error.message : undefined,
        ),
      });
    } finally {
      aiSettings.setIsTesting(false);
    }
  };

  const handleSaveAiSettings = async () => {
    // We allow saving if:
    // 1. User entered a new key
    // 2. OR user is just switching active provider/model (and has a saved key for it)

    if (!aiSettings.apiKey.trim() && !currentHasKey) {
      toast.error(`Please enter an API key for ${AI_PROVIDERS[aiSettings.selectedProvider].name}`);
      return;
    }

    aiSettings.setIsLoading(true);
    const selectedModel =
      aiSettings.selectedModel || getDefaultModel(aiSettings.selectedProvider);
    const modelChanged = savedSettings?.model !== selectedModel;

    try {
      await saveSettings({
        provider: aiSettings.selectedProvider,
        // Only send API key if user typed one. If empty but hasSavedKey, send undefined to keep existing.
        apiKey: aiSettings.apiKey.trim() || undefined,
        model: selectedModel,
        makeActive: true, // When saving from UI, we make it the active provider
      });

      trackAISettingsUpdated({
        ai_provider: aiSettings.selectedProvider,
        ai_model: selectedModel,
        model_changed: modelChanged,
      });

      toast.success("Settings saved successfully!");
      // Update local state to reflect we now have a key
      aiSettings.setHasKey(aiSettings.selectedProvider, true);
      // Clear input since it's saved
      aiSettings.setApiKey("");

      settings.onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      aiSettings.setIsLoading(false);
    }
  };

  const handleRemoveApiKey = async () => {
    // This removes ALL settings currently (deleteSettings). 
    // Ideally we should allow removing just ONE key.
    // For now, keeping "Remove All" or we update deleteSettings to take a provider?
    // Let's just keep global reset for now as per previous logic, or safeguard it.

    if (!confirm("Are you sure you want to remove ALL your AI settings and keys?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSettings();
      toast.success("All settings removed successfully");
      aiSettings.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove settings"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-medium">My settings</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "appearance"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "ai"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            AI Settings
          </button>
        </div>

        <div className="py-4">
          {activeTab === "appearance" && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <Label>Appearance</Label>
                <span className="text-[0.8rem] text-muted-foreground">
                  Customize how Noted looks on your device!
                </span>
              </div>
              <ModeToggle />
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              {/* Provider Selection */}
              <div className="flex flex-col gap-y-2">
                <Label>AI Provider</Label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={aiSettings.isLoading || aiSettings.isTesting}
                    >
                      <div className="flex items-center">
                        {AI_PROVIDERS[aiSettings.selectedProvider].name}
                        {savedSettings?.provider === aiSettings.selectedProvider && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">Active</span>
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    align="start"
                  >
                    {(Object.keys(AI_PROVIDERS) as AIProvider[]).map((provider) => {
                      // Check if we have a key for this provider from savedSettings
                      let hasKey = false;
                      if (provider === "openai") hasKey = savedSettings?.hasOpenAIKey || false;
                      if (provider === "anthropic") hasKey = savedSettings?.hasAnthropicKey || false;
                      if (provider === "google") hasKey = savedSettings?.hasGoogleKey || false;

                      const isSelected = aiSettings.selectedProvider === provider;
                      const isActive = savedSettings?.provider === provider;

                      return (
                        <DropdownMenuItem
                          key={provider}
                          onClick={() => aiSettings.setSelectedProvider(provider)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="flex items-center gap-2">
                                {AI_PROVIDERS[provider].name}
                                {isActive && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Active</span>}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {AI_PROVIDERS[provider].description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {hasKey && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                              {isSelected && <Check className="h-4 w-4" />}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* API Key Input */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="api-key">
                  {AI_PROVIDERS[aiSettings.selectedProvider].name} API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder={currentHasKey ? "Saved (Enter new key to update)" : AI_PROVIDERS[aiSettings.selectedProvider].placeholder}
                  value={aiSettings.apiKey}
                  onChange={(e) => aiSettings.setApiKey(e.target.value)}
                  disabled={aiSettings.isLoading || aiSettings.isTesting}
                />
                <span className="text-[0.8rem] text-muted-foreground">
                  Your API key is encrypted and stored securely. We never see your key.
                </span>
              </div>

              {/* Test Connection Button */}
              <div className="flex gap-2">
                <Button
                  onClick={handleTestConnection}
                  disabled={
                    !aiSettings.apiKey.trim() ||
                    aiSettings.isTesting ||
                    aiSettings.isLoading
                  }
                  variant="outline"
                  size="sm"
                >
                  {aiSettings.isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              </div>

              {/* Model Selection */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="model">Default Model</Label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={aiSettings.isLoading}
                    >
                      {providerModels.find((m) => m.id === aiSettings.selectedModel)?.name ||
                        aiSettings.selectedModel ||
                        "Select a model"}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
                    align="start"
                  >
                    <ScrollArea className="h-[200px]">
                      <div className="p-1">
                        {providerModels.map((model) => (
                          <DropdownMenuItem
                            key={model.id}
                            onClick={() =>
                              aiSettings.setSelectedModel(model.id)
                            }
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              {aiSettings.selectedModel === model.id && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <div>
                  {savedSettings && (
                    <Button
                      variant="destructive"
                      onClick={handleRemoveApiKey}
                      disabled={isDeleting || aiSettings.isLoading}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove All Settings
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      settings.onClose();
                      aiSettings.reset();
                    }}
                    disabled={aiSettings.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAiSettings}
                    disabled={
                      (!aiSettings.apiKey.trim() && !currentHasKey) ||
                      aiSettings.isLoading ||
                      aiSettings.isTesting
                    }
                  >
                    {aiSettings.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
