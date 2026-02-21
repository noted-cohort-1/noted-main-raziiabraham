"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCoworkerConfig } from "@/hooks/useCoworkerConfig";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bot, Loader2, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export function CoworkerAgentConfig() {
    const router = useRouter();

    const {
        isLoading,
        isSaving,
        isActive,
        hasConfig,
        instructionsDocId,
        setLoading,
        setSaving,
        setActive,
        setHasConfig,
        setInstructionsDocId,
    } = useCoworkerConfig();

    // Load config from Convex
    const config = useQuery(api.coworkerConfig.getConfig);
    const documents = useQuery(api.documents.getSearch);
    const upsertConfig = useMutation(api.coworkerConfig.upsertConfig);
    const toggleActive = useMutation(api.coworkerConfig.toggleActive);

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
            setInstructionsDocId(config.instructionsDocId || null);
        } else {
            setHasConfig(false);
            setInstructionsDocId(null);
        }
    }, [config, setLoading, setHasConfig, setActive, setInstructionsDocId]);

    const handleSave = async () => {
        if (!instructionsDocId) {
            toast.error("Please select an instruction document");
            return;
        }

        setSaving(true);
        try {
            await upsertConfig({
                instructionsDocId: instructionsDocId
            });
            setHasConfig(true);
            toast.success("Configuration saved!");
        } catch (error) {
            toast.error("Failed to save configuration");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async () => {
        if (!hasConfig) {
            toast.error("Please save your configuration first");
            return;
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

    const navigateToDocument = () => {
        if (instructionsDocId) {
            router.push(`/documents/${instructionsDocId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl p-6">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">AI Squad Agent</h1>
                    <p className="text-muted-foreground">
                        Configure your AI squad members
                    </p>
                </div>
            </div>

            {/* Status Toggle */}
            <div className="mb-6 flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                <div>
                    <Label className="text-base font-medium">Agent Status</Label>
                    <p className="text-sm text-muted-foreground">
                        {isActive ? "Agent is active and ready to help" : "Agent is paused"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Switch
                        checked={isActive}
                        onCheckedChange={handleToggleActive}
                        disabled={!hasConfig}
                    />
                    <span
                        className={cn(
                            "text-sm font-medium",
                            isActive ? "text-green-600" : "text-muted-foreground"
                        )}
                    >
                        {isActive ? "Active" : "Paused"}
                    </span>
                </div>
            </div>

            {/* Instruction Document Selector */}
            <div className="mb-6 space-y-2">
                <Label htmlFor="instruction-doc">Instruction Document</Label>
                <p className="text-sm text-muted-foreground mb-3">
                    Select a document that defines your squad member&apos;s personality and behavior.
                    The content of this document will be used as the system prompt.
                </p>
                <Select
                    value={instructionsDocId || "none"}
                    onValueChange={(value) => setInstructionsDocId(value === "none" ? null : value as Id<"documents">)}
                >
                    <SelectTrigger id="instruction-doc" className="w-full">
                        <SelectValue placeholder="Select a document..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Select a document...</SelectItem>
                        {documents?.map((doc) => (
                            <SelectItem key={doc._id} value={doc._id}>
                                <div className="flex items-center gap-2">
                                    {doc.icon && <span className="mr-1">{doc.icon}</span>}
                                    {doc.title}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {instructionsDocId && (
                    <div className="flex items-center gap-2 pt-2">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            ✓ Connected to document content
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={navigateToDocument}
                        >
                            <FileText className="h-3 w-3 mr-1" />
                            Edit Document
                        </Button>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mb-6 rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>How it works:</strong> Write your squad member&apos;s instructions in the selected document.
                    Describe their role, personality, and how they should respond. The squad member will use
                    this as their system prompt, combined with tool-calling capabilities.
                </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving || !instructionsDocId}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Configuration
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
