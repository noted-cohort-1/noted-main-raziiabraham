"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bot, User, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface CoworkerCardProps {
    id: string;
    name: string;
    description: string;
    creator: string;
    icon?: React.ReactNode;
    creatorImage?: string;
    color?: string;
}

export function CoworkerCard({
    id,
    name,
    description,
    creator,
    icon,
    creatorImage,
    color = "bg-orange-100",
}: CoworkerCardProps) {
    const router = useRouter();
    const config = useQuery(api.coworkerConfig.getConfig);
    const createDocument = useMutation(api.documents.create);
    const updateDocument = useMutation(api.documents.update);
    const upsertConfig = useMutation(api.coworkerConfig.upsertConfig);
    const resetConfig = useMutation(api.coworkerConfig.resetConfig);

    const handleClick = async () => {
        // For the marketing specialist
        if (id === "marketing-specialist") {
            // If we have a linked document, go to it
            if (config?.instructionsDocId) {
                router.push(`/documents/${config.instructionsDocId}`);
                return;
            }

            // Otherwise, initialize it
            const docId = await createDocument({
                title: "Marketing Intelligence Specialist",
                parentDocument: undefined
            });

            // Set the icon to our custom logo and add default content
            await updateDocument({
                id: docId,
                icon: "/agent-logo.png",
                content: JSON.stringify([
                    {
                        type: "heading",
                        content: [{ type: "text", text: "Role & Objective", styles: {} }],
                        props: { level: 2 }
                    },
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "You are a specialized Marketing Intelligence Analyst designed to help the team understand market dynamics, track competitor movements, and identify growth opportunities. Your goal is to provide actionable insights backed by data and strategic frameworks.", styles: {} }]
                    },
                    {
                        type: "heading",
                        content: [{ type: "text", text: "Core Responsibilities", styles: {} }],
                        props: { level: 2 }
                    },
                    {
                        type: "bulletListItem",
                        content: [{ type: "text", text: "Competitor Analysis: Monitor and analyze competitor strategies, pricing, and messaging.", styles: {} }]
                    },
                    {
                        type: "bulletListItem",
                        content: [{ type: "text", text: "Trend Spotting: Identify emerging market trends and consumer behavior shifts.", styles: {} }]
                    },
                    {
                        type: "bulletListItem",
                        content: [{ type: "text", text: "Campaign Optimization: Suggest improvements for marketing campaigns based on performance metrics.", styles: {} }]
                    },
                    {
                        type: "heading",
                        content: [{ type: "text", text: "Tone & Style", styles: {} }],
                        props: { level: 2 }
                    },
                    {
                        type: "bulletListItem",
                        content: [{ type: "text", text: "Analytical yet accessible (avoid overly academic jargon).", styles: {} }]
                    },
                    {
                        type: "bulletListItem",
                        content: [{ type: "text", text: "Proactive and solution-oriented.", styles: {} }]
                    }
                ])
            });

            // Link it to the config
            await upsertConfig({
                instructionsDocId: docId,
                persona: {
                    name: "Marketing Intelligence Specialist",
                    systemPrompt: "You are a specialized Marketing Intelligence Analyst.",
                    tone: "Professional, Insightful",
                    focusAreas: ["Market Trends", "Competitor Analysis"]
                },
                // isActive is not needed here as it's separate or default, 
                // but checking schema upsertConfig expects: persona (object) + instructionsDocId (id)
            });

            // Navigate
            router.push(`/documents/${docId}`);
        } else {
            // Fallback for other potential agents
            router.push(`/coworkers/${id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
            <div>
                <div className="flex items-start justify-between">
                    <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-white border shadow-sm", color)}>
                        {icon || (
                            <div className="relative h-8 w-8">
                                <Image
                                    src="/agent-logo.png"
                                    alt="Agent Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>
                    {/* Debug Reset Button */}
                    <div
                        role="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            resetConfig();
                            toast.success("Configuration reset");
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
                        title="Reset Configuration (Debug)"
                    >
                        <Trash2 className="h-4 w-4" />
                    </div>
                </div>
                <h3 className="mb-2 font-semibold leading-none tracking-tight">{name}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                    {description}
                </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
                <Avatar className="h-5 w-5">
                    <AvatarImage src={creatorImage} />
                    <AvatarFallback className="text-[10px]">
                        <User className="h-3 w-3" />
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{creator}</span>
            </div>
        </div>
    );
}
