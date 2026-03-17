import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageSquarePlus, PenTool } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function AIWritingFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        WRITE FASTER WITH AI
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    Your creative superpower.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    Generate content, brainstorm ideas, and improve your writing directly in your documents. Bring your own API key for complete control and privacy.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-xl w-full text-left">
                    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                        {/* Editor with AI Menu */}
                        <div className="p-6">
                            <div className="mb-4 space-y-2">
                                <div className="h-4 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
                                <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                                <div className="h-4 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
                            </div>

                            {/* AI Command Menu Mockup */}
                            <div className="relative z-10 mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                                <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50">
                                    Ask AI to...
                                </div>
                                <div className="p-1">
                                    <div className="flex items-center gap-2 rounded-md bg-blue-50 px-2 py-1.5 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                        <span className="text-lg">✨</span>
                                        <span>Continue writing</span>
                                        <span className="ml-auto flex h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
                                        <span className="text-lg">📝</span>
                                        <span>Summarize</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
                                        <span className="text-lg">🔄</span>
                                        <span>Fix grammar</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 opacity-50">
                                <div className="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
                                <div className="h-4 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Inline Generation</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Stuck on a thought? Just ask AI to finish your sentence, draft a new section, or instantly generate a brainstroming list directly in the editor.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            <PenTool className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Improve Writing</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Highlight any text and instantly polish the tone, fix grammar mistakes, expand ideas, or synthesize complex paragraphs down to core talking points.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MessageSquarePlus className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">BYOK Control</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            No subscription tiers or credit limits to worry about. Enter your own OpenAI API key and only pay for exactly what you use, with total privacy.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Never hit writer's block again."
                subheadline="Join thousands of people who use Noted to organize thoughts, manage projects, and write ten times faster."
            />
        </div>
    );
}
