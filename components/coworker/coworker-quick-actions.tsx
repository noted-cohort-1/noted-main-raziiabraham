"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Search, Sparkles } from "lucide-react";

interface CoworkerQuickActionsProps {
    onAction: (action: string) => void;
    disabled?: boolean;
}

const quickActions = [
    { id: "status", label: "Status", icon: BarChart3, prompt: "What are you currently working on?" },
    { id: "brief", label: "Brief", icon: FileText, prompt: "Create a marketing brief for me" },
    { id: "research", label: "Research", icon: Search, prompt: "Research the competitive landscape" },
    { id: "ideas", label: "Ideas", icon: Sparkles, prompt: "Give me some creative ideas" },
];

export function CoworkerQuickActions({
    onAction,
    disabled,
}: CoworkerQuickActionsProps) {
    return (
        <div className="flex flex-wrap gap-1 border-t bg-muted/30 p-2">
            {quickActions.map((action) => (
                <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    onClick={() => onAction(action.prompt)}
                    className="h-7 gap-1 text-xs"
                >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                </Button>
            ))}
        </div>
    );
}
