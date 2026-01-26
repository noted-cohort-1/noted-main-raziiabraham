"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCoworkerConfig } from "@/hooks/useCoworkerConfig";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export function CoworkerSettingsDialog() {
    const [open, setOpen] = useState(false);

    const {
        isActive,
        hasConfig,
        setLoading,
        setActive,
        setHasConfig,
    } = useCoworkerConfig();

    // Load config from Convex
    const config = useQuery(api.coworkerConfig.getConfig);
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
        }
    }, [config, setLoading, setHasConfig, setActive]);

    const handleToggleActive = async () => {
        if (!hasConfig) {
            toast.error("Agent not fully configured yet.");
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
                            disabled={!hasConfig}
                        />
                    </div>
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
                                    try {
                                        await resetConfig();
                                        toast.success("Agent reset to defaults");
                                        setOpen(false);
                                        window.location.reload(); // Reload to trigger re-initialization
                                    } catch (e) {
                                        toast.error("Failed to reset");
                                    }
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
