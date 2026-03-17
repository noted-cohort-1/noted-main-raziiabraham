import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Zap, FileSearch } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function SearchFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        FIND ANYTHING INSTANTLY
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    Search that just works.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    Never lose a thought again. Press ⌘K to quickly search and find any document in seconds, no matter how large your workspace grows.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-xl w-full text-left">
                    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                        {/* Search Command Dialog - matches search-command.tsx */}
                        <div className="border-b border-neutral-100 p-4 dark:border-neutral-700">
                            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
                                <svg
                                    className="h-5 w-5 text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <span className="text-neutral-500">Search John&apos;s Noted..</span>
                            </div>
                        </div>
                        {/* Results - matches CommandItem with document icons */}
                        <div className="p-2">
                            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                                Documents
                            </div>
                            {[
                                { icon: "📋", title: "Project Roadmap" },
                                { icon: "📚", title: "Reading List" },
                                { icon: "💡", title: "Ideas & Inspiration" },
                                { icon: "📝", title: "Meeting Notes" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i === 0 ? "bg-primary/5" : "hover:bg-primary/5"}`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-sm text-neutral-700 dark:text-neutral-200">
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            No more waiting for loading spinners. The search index is optimized to deliver results as fast as you can type, finding titles and robust body content.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            <FileSearch className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Universal Search</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            The command palette searches through every nested folder, page, and subpage in your workspace automatically. Nothing can be lost.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Keyboard First</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Navigate your entire workspace without ever touching your mouse. Press ⌘K, type, and hit enter. It's that seamless.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Stop searching. Start finding."
                subheadline="Join thousands of people who use Noted to build their second brain and surface knowledge instantly."
            />
        </div>
    );
}
