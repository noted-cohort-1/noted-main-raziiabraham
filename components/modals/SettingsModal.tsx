"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
import { useSettings } from "@/hooks/useSettings";
import { useAiSettings } from "@/hooks/useAiSettings";
import { useAction, useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ModeToggle } from "../mode-toggle";
import { Loader2, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const getAvailableModels = useAction(api.aiSettingsActions.getAvailableModels);
  const saveSettings = useAction(api.aiSettingsActions.saveSettings);
  const loadSavedModels = useAction(
    (api.aiSettingsActions as any).loadSavedModels,
  );
  const deleteSettings = useMutation(api.aiSettings.deleteSettings);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (savedSettings && activeTab === "ai") {
      // Show that settings are saved by setting a placeholder
      if (savedSettings.provider) {
        aiSettings.setApiKey("••••••••••••••••");
      }
      if (savedSettings.model) {
        aiSettings.setSelectedModel(savedSettings.model);
      }
      // Load models if settings exist
      if (savedSettings.provider === "openai") {
        loadSavedModels({}).then((result) => {
          if (result.success && result.models) {
            aiSettings.setAvailableModels(result.models);
            if (result.selectedModel) {
              aiSettings.setSelectedModel(result.selectedModel);
            }
          }
        }).catch(() => {
          // Silently fail - user can manually fetch models if needed
        });
      }
    } else if (!savedSettings && activeTab === "ai") {
      // Reset if no saved settings - only reset if we had something before
      if (aiSettings.apiKey || aiSettings.selectedModel) {
        aiSettings.reset();
      }
    }
  }, [savedSettings, activeTab]);

  const handleTestAndFetchModels = async () => {
    if (!aiSettings.apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    aiSettings.setIsTesting(true);
    try {
      const testResult = await testConnection({ apiKey: aiSettings.apiKey });

      if (testResult.success) {
        toast.success("Connection successful! Fetching available models...");
        aiSettings.setIsFetchingModels(true);

        const modelsResult = await getAvailableModels({
          apiKey: aiSettings.apiKey,
        });

        if (modelsResult.success && modelsResult.models) {
          aiSettings.setAvailableModels(modelsResult.models);
          if (
            modelsResult.models.length > 0 &&
            !aiSettings.selectedModel
          ) {
            aiSettings.setSelectedModel(modelsResult.models[0].id);
          }
        } else {
          toast.error(modelsResult.error || "Failed to fetch models");
        }
      } else {
        toast.error(testResult.error || "Connection failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Connection failed",
      );
    } finally {
      aiSettings.setIsTesting(false);
      aiSettings.setIsFetchingModels(false);
    }
  };

  const handleSaveAiSettings = async () => {
    if (!aiSettings.apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    aiSettings.setIsLoading(true);
    try {
      await saveSettings({
        provider: "openai",
        apiKey: aiSettings.apiKey,
        model: aiSettings.selectedModel || undefined,
      });

      toast.success("Settings saved successfully!");
      aiSettings.onClose();
      aiSettings.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      aiSettings.setIsLoading(false);
    }
  };

  const handleRemoveApiKey = async () => {
    if (!confirm("Are you sure you want to remove your API key? AI features will be disabled.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSettings();
      toast.success("API key removed successfully");
      aiSettings.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove API key"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
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
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={aiSettings.apiKey}
                  onChange={(e) => aiSettings.setApiKey(e.target.value)}
                  disabled={aiSettings.isLoading || aiSettings.isTesting}
                />
                <span className="text-[0.8rem] text-muted-foreground">
                  Your API key is encrypted and stored securely. We never see
                  your key.
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTestAndFetchModels}
                  disabled={
                    !aiSettings.apiKey.trim() ||
                    aiSettings.isTesting ||
                    aiSettings.isFetchingModels ||
                    aiSettings.isLoading
                  }
                  variant="outline"
                >
                  {aiSettings.isTesting || aiSettings.isFetchingModels ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {aiSettings.isTesting
                        ? "Testing..."
                        : "Fetching models..."}
                    </>
                  ) : (
                    "Save & Test"
                  )}
                </Button>
              </div>

              {aiSettings.availableModels.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="model">Default Model</Label>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={aiSettings.isLoading}
                      >
                        {aiSettings.selectedModel || "Select a model"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
                      align="start"
                    >
                      <ScrollArea className="h-[180px]">
                        <div className="p-1">
                          {aiSettings.availableModels.map((model) => (
                            <DropdownMenuItem
                              key={model.id}
                              onClick={() =>
                                aiSettings.setSelectedModel(model.id)
                              }
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{model.id}</span>
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
              )}

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
                          Remove API Key
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      aiSettings.onClose();
                      aiSettings.reset();
                    }}
                    disabled={aiSettings.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAiSettings}
                    disabled={
                      !aiSettings.apiKey.trim() ||
                      aiSettings.isLoading ||
                      aiSettings.isTesting ||
                      aiSettings.isFetchingModels
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
