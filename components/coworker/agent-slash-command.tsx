"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bot, Search, Command as CommandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface AgentSlashCommandProps {
    onSelect: (agent: any) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function AgentSlashCommand({
    onSelect,
    isOpen,
    onClose
}: AgentSlashCommandProps) {
    const agents = useQuery((api as any).squadAgents.list);

    // Filter agents for the list
    const agentList = agents || [];

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-[300px] bg-background border rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <Command className="rounded-xl border-none">
                <CommandList className="max-h-[250px]">
                    <CommandEmpty>No agents found.</CommandEmpty>
                    <CommandGroup heading="Available Agents">
                        {/* Custom Squad Agents */}
                        {agentList.map((agent: any) => (
                            <CommandItem
                                key={agent._id}
                                onSelect={() => {
                                    onSelect(agent);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                            >
                                <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center text-sm">
                                    {agent.icon || "🤖"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{agent.name}</span>
                                    {agent.description && (
                                        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                            {agent.description}
                                        </span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}
