import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Type, ListTree, Smile, LayoutTemplate } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function EditorFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        WRITE AND ORGANIZE
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    Your thoughts, your way.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    A powerful block-based editor that adapts to how you think. Create
                    documents, take notes, and build your personal knowledge base—all in
                    one place.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-2xl w-full text-left">
                    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                        {/* Document with toolbar - matches toolbar.tsx */}
                        <div className="p-6">
                            {/* Icon */}
                            <div className="mb-2 text-5xl">📝</div>
                            {/* Title - matches the 5xl bold style */}
                            <div className="mb-4 text-4xl font-bold text-foreground">
                                Meeting Notes
                            </div>
                            {/* Add icon / Add cover buttons - matches toolbar.tsx */}
                            <div className="mb-4 flex gap-2">
                                <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
                                    <span>😊</span> Add icon
                                </button>
                                <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
                                    <svg
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Add cover
                                </button>
                            </div>
                            {/* Editor blocks */}
                            <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-start gap-2">
                                    <span className="text-neutral-400">•</span>
                                    <span>Discuss Q4 roadmap priorities</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-neutral-400">•</span>
                                    <span>Review team feedback</span>
                                </div>
                                <div className="mt-3 rounded-md border-l-4 border-amber-400 bg-amber-50 p-2 text-sm dark:bg-amber-900/20">
                                    💡 Action item: Follow up with design team
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
                            <Type className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Block-based editor</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Every paragraph, image, or list is a block. Drag and drop them to
                            reorganize your thoughts effortlessly.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            <ListTree className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Nested pages</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Create pages inside pages infinitely. Build your own personal wiki and organize projects exactly how your brain works.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Smile className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Custom icons</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Make it yours. Express yourself and visually organize your workspace by assigning emojis to every document.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Ready to start organizing?"
                subheadline="Join thousands of people who use Noted to organize thoughts, manage projects, and bring ideas to life."
            />
        </div>
    );
}
