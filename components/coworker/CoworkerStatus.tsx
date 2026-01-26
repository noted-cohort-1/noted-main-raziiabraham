"use client";

import { cn } from "@/lib/utils";

interface CoworkerStatusProps {
    isActive: boolean;
    isStreaming?: boolean;
    className?: string;
}

export function CoworkerStatus({
    isActive,
    isStreaming,
    className,
}: CoworkerStatusProps) {
    return (
        <div className={cn("flex items-center gap-2 text-xs", className)}>
            <div
                className={cn(
                    "h-2 w-2 rounded-full",
                    isStreaming
                        ? "animate-pulse bg-yellow-500"
                        : isActive
                            ? "bg-green-500"
                            : "bg-gray-400"
                )}
            />
            <span className="text-muted-foreground">
                {isStreaming ? "Working..." : isActive ? "Active" : "Paused"}
            </span>
        </div>
    );
}
