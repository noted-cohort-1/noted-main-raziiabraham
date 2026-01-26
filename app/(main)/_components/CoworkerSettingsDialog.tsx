"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCoworkerConfig } from "@/hooks/useCoworkerConfig";
import {
    TONE_OPTIONS,
    FOCUS_AREA_SUGGESTIONS,
} from "@/lib/agent/prompts/marketing-persona";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Loader2, Save, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CoworkerSettingsDialog() {
    const [open, setOpen] = useState(false);
    const [focusInput, setFocusInput] = useState("");

    const {
        isLoading,
        isSaving,
        isActive,
        persona,
        hasConfig,
        setLoading,
        setSaving,
        setActive,
        setPersona,
        setHasConfig,
        updatePersonaField,
    } = useCoworkerConfig();

    // Load config from Convex
    const config = useQuery(api.coworkerConfig.getConfig);
    const upsertConfig = useMutation(api.coworkerConfig.upsertConfig);
    const toggleActive = useMutation(api.coworkerConfig.toggleActive);
    const resetConfig = useMutation(api.coworkerConfig.resetConfig);

    // Sync config from Convex
    useEffect(() => {
        if (config === undefined) {
            setLoading(true);
            return;
        }

        setLoading(false);

        if (config) {
            setHasConfig(true);
            setActive(config.isActive);
            setPersona(config.persona);
        }
    }, [config, setLoading, setHasConfig, setActive, setPersona]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await upsertConfig({ persona });
            setHasConfig(true);
            toast.success("Settings saved!");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to save settings");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async () => {
        if (!hasConfig) {
            // If no config yet, save first
            await handleSave();
        }
        try {
            const newState = await toggleActive();
            setActive(newState);
            toast.success(newState ? "Agent activated" : "Agent paused");
        } catch (error) {
            toast.error("Failed to toggle agent status");
            console.error(error);
        }
    };

    const addFocusArea = () => {
        if (focusInput.trim() && !persona.focusAreas.includes(focusInput.trim())) {
            updatePersonaField("focusAreas", [...persona.focusAreas, focusInput.trim()]);
            setFocusInput("");
        }
    };

    const removeFocusArea = (area: string) => {
        updatePersonaField(
            "focusAreas",
            persona.focusAreas.filter((a) => a !== area)
        );
    };

    const addSuggestedFocus = (suggestion: string) => {
        if (!persona.focusAreas.includes(suggestion)) {
            updatePersonaField("focusAreas", [...persona.focusAreas, suggestion]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Coworker Settings</DialogTitle>
                    <DialogDescription>
                        Configure behavior and preferences for this coworker.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium">Active Status</Label>
                            <span className="text-xs text-muted-foreground">
                                Enable or disable this coworker
                            </span>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggleActive}
                        />
                    </div>

                    {/* Tone */}
                    <div className="space-y-2">
                        <Label htmlFor="tone">Communication Tone</Label>
                        <Select
                            value={persona.tone}
                            onValueChange={(value) => updatePersonaField("tone", value)}
                        >
                            <SelectTrigger id="tone">
                                <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                                {TONE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Focus Areas */}
                    <div className="space-y-2">
                        <Label>Focus Areas</Label>
                        <div className="flex gap-2">
                            <Input
                                value={focusInput}
                                onChange={(e) => setFocusInput(e.target.value)}
                                placeholder="Add focus area..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addFocusArea();
                                    }
                                }}
                                className="h-8"
                            />
                            <Button type="button" size="sm" variant="secondary" onClick={addFocusArea}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 min-h-[60px] content-start">
                            {persona.focusAreas.map((area) => (
                                <Badge key={area} variant="secondary" className="gap-1 pr-1">
                                    {area}
                                    <button
                                        onClick={() => removeFocusArea(area)}
                                        className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>

                        <div className="pt-2 border-t">
                            <p className="mb-2 text-xs text-muted-foreground">Suggestions:</p>
                            <div className="flex flex-wrap gap-1">
                                {FOCUS_AREA_SUGGESTIONS.filter(
                                    (s) => !persona.focusAreas.includes(s)
                                ).slice(0, 5).map((suggestion) => (
                                    <Button
                                        key={suggestion}
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-[10px] px-2"
                                        onClick={() => addSuggestedFocus(suggestion)}
                                    >
                                        + {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>

                {/* Danger Zone */}
                <div className="mt-6 pt-6 border-t">
                    <h4 className="text-xs font-semibold text-destructive mb-3 uppercase tracking-wider">Danger Zone</h4>
                    <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 p-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-900 dark:text-red-200">Reset Agent</span>
                            <span className="text-xs text-red-700 dark:text-red-300">
                                This will archive the current instructions and create a fresh one.
                            </span>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                                if (confirm("Are you sure you want to reset your agent? This will unlink the current instructions document.")) {
                                    await resetConfig();
                                    toast.success("Agent reset to defaults");
                                    setOpen(false);
                                    window.location.reload(); // Reload to trigger re-initialization
                                }
                            }}
                        >
                            Reset to Defaults
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
