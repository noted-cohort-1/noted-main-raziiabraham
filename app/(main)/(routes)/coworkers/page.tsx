"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useAction, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { CoworkerCard } from "../../_components/coworker-card";
import { Search, Plus, Wrench, Bot, Loader2, Settings, ExternalLink, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator";
import { random } from "node-emoji";
import { useSettings } from "@/hooks/use-settings";
import Image from "next/image";

export default function CoworkersPage() {
    const { user } = useUser();
    const router = useRouter();
    const openSettings = useSettings();
    const [activeTab, setActiveTab] = useState<"agents" | "tools">("agents");
    const [searchQuery, setSearchQuery] = useState("");

    // Queries & Mutations
    const squadAgents = useQuery((api as any).squadAgents.list);
    const createDocument = useMutation(api.documents.create);
    const updateDocument = useMutation(api.documents.update);
    const createAgent = useMutation((api as any).squadAgents.create);
    const savedSettings = useQuery(api.aiSettings.getSettings);
    const hasRelevanceKey = !!(savedSettings as any)?.hasRelevanceKey;

    // Relevance AI data
    const listRelevanceAgentsFn = useAction((api as any).aiSettingsActions.listRelevanceAgents);
    const [relevanceAgents, setRelevanceAgents] = useState<any[]>([]);
    const [loadingRelevance, setLoadingRelevance] = useState(false);

    useEffect(() => {
        if (!hasRelevanceKey) return;
        setLoadingRelevance(true);
        listRelevanceAgentsFn({})
            .then((agents: any[]) => setRelevanceAgents(agents))
            .catch(() => { /* silently fail */ })
            .finally(() => setLoadingRelevance(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasRelevanceKey]);

    const isLoading = squadAgents === undefined;

    // Filter agents based on search
    const filteredAgents = squadAgents?.filter((agent: any) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create a new squad agent
    const handleAddAgent = async () => {
        const DEFAULT_INSTRUCTIONS = JSON.stringify([
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Summary", styles: {} }] },
            { type: "paragraph", content: [{ type: "text", text: "Write or Ask AI to write a short description about this AI Squad agent. This will be displayed in the card.", styles: { textColor: "gray" } }] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Role", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Task", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Output", styles: {} }] },
            { type: "paragraph", content: [] },
            { type: "heading", props: { level: 3 }, content: [{ type: "text", text: "Constraint", styles: {} }] },
            { type: "paragraph", content: [] },
        ]);

        const randomName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: ' ',
            style: 'lowerCase'
        });
        const randomIcon = random().emoji;

        const promise = (async () => {
            // 1. Create the instructions document
            const docId = await createDocument({
                title: randomName,
                content: DEFAULT_INSTRUCTIONS,
            });

            // 1.5 Add the randomly selected icon to the document
            await updateDocument({
                id: docId,
                icon: randomIcon,
            });

            // 2. Create the squad agent linked to this doc
            const agentId = await createAgent({
                name: randomName,
                description: "Describe your agent's persona and goals in the linked instructions document.",
                icon: randomIcon,
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
                        {/* Filters & Actions */}
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

                            {/* List Noted agents */}
                            {isLoading ? (
                                <div className="flex items-center justify-center col-span-full py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                filteredAgents?.map((agent: any) => (
                                    <CoworkerCard
                                        key={agent._id}
                                        id={agent.instructionsDocId}
                                        name={agent.name}
                                        description={agent.description || "Experimental AI Squad Agent"}
                                        creator={user?.fullName || "Me"}
                                        creatorImage={user?.imageUrl}
                                        icon={agent.icon ? <span className="text-2xl">{agent.icon}</span> : undefined}
                                        color="bg-blue-50"
                                    />
                                ))
                            )}

                            {/* Relevance AI Agents */}
                            {relevanceAgents.map((agent) => {
                                const hasValidAvatar = agent.avatarUrl &&
                                    (agent.avatarUrl.startsWith("http") || agent.avatarUrl.startsWith("/"));

                                return (
                                    <CoworkerCard
                                        key={agent.id}
                                        name={agent.name}
                                        description={agent.description || "Relevance AI Agent"}
                                        icon={
                                            hasValidAvatar ? (
                                                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                                    <Image
                                                        src={agent.avatarUrl}
                                                        alt={agent.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : agent.icon && agent.icon.length <= 4 ? (
                                                <span className="text-2xl">{agent.icon}</span>
                                            ) : (
                                                <div className="relative h-8 w-8">
                                                    <Image
                                                        src="/relevance-logo.jpeg"
                                                        alt="Relevance AI"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )
                                        }
                                        color="bg-violet-50"
                                        creator="Relevance AI"
                                        creatorImage="/relevance-logo.jpeg"
                                    />
                                );
                            })}

                            {/* Connect Relevance AI */}
                            {!hasRelevanceKey && !isLoading && (
                                <div
                                    onClick={() => { openSettings.onOpen(); }}
                                    className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-xl bg-violet-50/30 dark:bg-violet-900/10 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all cursor-pointer min-h-[200px]"
                                >
                                    <Zap className="h-8 w-8 text-violet-400 mb-2" />
                                    <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Connect Relevance AI</span>
                                    <span className="text-xs text-muted-foreground mt-1 text-center">Add your API key in Settings → Tools</span>
                                </div>
                            )}

                            {/* Empty state if no search results */}
                            {!isLoading && filteredAgents?.length === 0 && searchQuery && (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    No agents found matching “{searchQuery}”
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Tools Tab — Simple empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-5">
                            <Wrench className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Tools</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                            This page is for managing Noted’s agents. Your Relevance AI tools can be managed directly on{" "}
                            <a
                                href="https://app.relevanceai.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                            >
                                their platform
                            </a>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
