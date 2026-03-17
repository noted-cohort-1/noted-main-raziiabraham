import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, FolderKey } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function SquadFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        MEET YOUR AI SQUAD
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    AI coworkers that get things done.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    Create custom AI coworkers with role-specific instructions. Chat with your squad, and they'll write documents, research your workspace, and organize your notes — all using your own API key.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-sm w-full text-left">
                    <div className="relative overflow-hidden rounded-2xl border bg-background shadow-2xl dark:border-neutral-700">
                        {/* Header — matches coworker-floating-chat.tsx */}
                        <div className="flex items-center justify-between border-b px-4 py-3 bg-background/95 backdrop-blur">
                            <div className="flex items-center gap-2 px-2 py-1 rounded-md">
                                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary/10">
                                    {/* Bot icon */}
                                    <svg className="h-3.5 w-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-foreground">AI Squad</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* SquarePen (new chat) */}
                                <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 cursor-pointer">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 7.125L18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </div>
                                {/* PanelRight (dock) */}
                                <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 cursor-pointer">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm10 0v18" />
                                    </svg>
                                </div>
                                {/* X (close) */}
                                <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 cursor-pointer">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages — matches coworker-message.tsx */}
                        <div className="space-y-3 px-4 py-4">
                            {/* User message — right-aligned, muted bg, rounded-tr-md */}
                            <div className="flex w-full gap-2 justify-end">
                                <div className="flex flex-col gap-1.5 max-w-[85%] items-end">
                                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-md bg-muted/80 text-sm leading-relaxed text-foreground">
                                        <div className="whitespace-pre-wrap break-words">Write me a project brief for the new product launch</div>
                                    </div>
                                </div>
                            </div>

                            {/* Assistant message — left-aligned, full width */}
                            <div className="flex w-full gap-2 justify-start">
                                <div className="flex flex-col gap-1.5 w-full pr-1">
                                    {/* Reasoning — collapsible "Thought" */}
                                    <button className="flex items-center gap-1.5 text-muted-foreground text-xs py-1 select-none">
                                        <span className="font-medium text-[12px] opacity-70">Thought</span>
                                        <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Tool step — inline text, matches getToolDisplayName */}
                                    <div className="w-full py-0.5">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs select-none pl-0.5">
                                            <span className="font-medium text-[12px] opacity-70">Content created</span>
                                        </div>
                                    </div>

                                    {/* Text response — no bubble, prose styling */}
                                    <div className="text-sm leading-relaxed bg-transparent px-0 py-1 text-foreground">
                                        <div className="prose-sm dark:prose-invert">
                                            <p className="mb-2 last:mb-0 leading-relaxed">
                                                Done! I&apos;ve created <strong>&quot;🚀 Product Launch Brief&quot;</strong> with the executive summary, timeline, and key milestones. You can find it in your sidebar.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input Area — matches the rounded-[24px] pill form */}
                        <div className="p-4 pt-2">
                            <div className="relative flex flex-col rounded-[24px] border bg-background shadow-lg ring-1 ring-black/5">
                                {/* Textarea placeholder */}
                                <div className="w-full min-h-[40px] px-4 pt-4 text-sm text-muted-foreground/60">
                                    Ask anything ... or / for your agents
                                </div>
                                {/* Bottom bar — paperclip, @context, send */}
                                <div className="flex items-center justify-between px-4 pb-3 pt-2">
                                    <div className="flex items-center gap-3">
                                        {/* Paperclip */}
                                        <svg className="h-4 w-4 text-muted-foreground -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 008.486 8.486L20.5 13" />
                                        </svg>
                                        {/* @Context */}
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-4 4H9a7 7 0 110-8h3a4 4 0 014 4z" />
                                            </svg>
                                            <span>Context</span>
                                        </div>
                                    </div>
                                    {/* Send button — dark circle with ArrowUp */}
                                    <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center">
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Bot className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Custom Agents</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Create specific agents for programming, marketing, or research. Give them tailored system prompts so they behave exactly how you want.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            <FolderKey className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Workspace Tools</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Your agents have access to the same tools you do. They can read documents, search your workspace, write new pages, and edit existing files automatically.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Cpu className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Multi-Model & BYOK</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Why settle for one model? Use GPT-4o, Claude 3.5 Sonnet, or Gemini 1.5 Pro. Enter your own API key to ensure complete privacy and zero markups.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Ready to assemble your squad?"
                subheadline="Join thousands of people who use Noted and their AI Squad to organize thoughts, manage projects, and bring ideas to life."
            />
        </div>
    );
}
