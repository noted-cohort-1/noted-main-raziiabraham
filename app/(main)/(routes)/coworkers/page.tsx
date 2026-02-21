"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { CoworkerCard } from "../../_components/CoworkerCard";
import { Search, Plus, Wrench, Bot, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CoworkersPage() {
    const { user } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"agents" | "tools">("agents");
    const [searchQuery, setSearchQuery] = useState("");

    // Queries & Mutations
    const squadAgents = useQuery((api as any).squadAgents.list);
    const createDocument = useMutation(api.documents.create);
    const createAgent = useMutation((api as any).squadAgents.create);

    const isLoading = squadAgents === undefined;

    // Filter agents based on search
    const filteredAgents = squadAgents?.filter((agent: any) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create a new squad agent
    const handleAddAgent = async () => {
        const DEFAULT_INSTRUCTIONS = JSON.stringify([
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Role", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Task", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Output", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Constraint", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Summary", styles: {} }] },
            { type: "paragraph", content: [] },
        ]);

        const promise = (async () => {
            // 1. Create the instructions document
            const docId = await createDocument({
                title: "New Agent Instructions",
                content: DEFAULT_INSTRUCTIONS,
            });

            // 2. Create the squad agent linked to this doc
            const agentId = await createAgent({
                name: "New Agent",
                description: "Describe your agent's persona and goals in the linked instructions document.",
                icon: "🤖",
                instructionsDocId: docId,
            });

            // 3. Navigate to the document for editing
            router.push(`/documents/${docId}`);
            return agentId;
        })();

        toast.promise(promise, {
            loading: "Creating squad agent...",
            success: "Squad agent created! Configure its instructions in the document.",
            error: "Failed to create squad agent.",
        });
    };

    return (
        <div className="flex flex-col h-full p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">AI Squad</h1>
                        <p className="text-muted-foreground text-sm">
                            Build and manage your autonomous coworkers
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b mb-8">
                    <button
                        onClick={() => setActiveTab("agents")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "agents" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Agents
                        {activeTab === "agents" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("tools")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "tools" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Tools
                        {activeTab === "tools" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                {activeTab === "agents" ? (
                    <>
                        {/* Filters */}
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search squad agents..."
                                    className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Create Button Card */}
                            <div
                                onClick={handleAddAgent}
                                className="group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-muted/5 hover:bg-muted/20 hover:border-primary/50 transition-all cursor-pointer min-h-[200px]"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <span className="text-sm font-semibold">Create Agent</span>
                                <span className="text-xs text-muted-foreground mt-1">Start a new squad member</span>
                            </div>

                            {/* List agents */}
                            {isLoading ? (
                                <div className="flex items-center justify-center col-span-full py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                filteredAgents?.map((agent: any) => (
                                    <CoworkerCard
                                        key={agent._id}
                                        id={agent.instructionsDocId} // Link directly to instructions doc
                                        name={agent.name}
                                        description={agent.description || "Experimental AI Squad Agent"}
                                        creator={user?.fullName || "Me"}
                                        creatorImage={user?.imageUrl}
                                        icon={agent.icon ? <span className="text-2xl">{agent.icon}</span> : undefined}
                                        color="bg-blue-50"
                                    />
                                ))
                            )}

                            {/* Empty state if no search results */}
                            {!isLoading && filteredAgents?.length === 0 && searchQuery && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-muted-foreground">No agents found matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Tools Tab Placeholder */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-20 w-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
                            <Wrench className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Build Custom Tools</h2>
                        <p className="text-muted-foreground max-w-sm mb-8">
                            Create reusable tools that your squad agents can use to interact with external APIs, process data, or perform complex tasks.
                        </p>
                        <div className="px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                            Coming Soon
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
