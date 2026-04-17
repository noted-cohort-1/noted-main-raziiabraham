import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Link2, MonitorSmartphone } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function PublishFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        SHARE WITH THE WORLD
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    Publish in one click.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    Turn any document into a public website instantly. Share your notes, guides, or portfolio with a simple link—no coding required.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-xl w-full text-left">
                    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                        {/* Publish UI */}
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🚀</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                                        My Portfolio
                                    </span>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                    Live
                                </span>
                            </div>

                            <div className="mb-4 rounded-lg border bg-muted/50 p-4">
                                <div className="mb-2 text-xs font-medium text-muted-foreground">
                                    Public URL
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <code className="block w-full max-w-full overflow-x-auto rounded bg-background px-3 py-2 text-sm font-mono break-all">
                                        wellnoted.dev/preview/abc123
                                    </code>
                                    <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white sm:w-auto">
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                <span>Anyone with the link can view</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Public Pages</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            No servers to manage. Toggle a switch and your Notion-like document is instantly live on the web, reading-optimized and beautiful.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Link2 className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Live Updating</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Real-time synchronization means you never have to hit "Deploy." Make a typo fix in the editor, and it's instantly reflected on the live page.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MonitorSmartphone className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Responsive Build</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether your readers are on a 4K monitor or an old iPhone, your published blocks, images, and tables automatically adapt to look perfect.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Share your ideas with everyone."
                subheadline="Join thousands of people who use Noted to publish guides, handbooks, and portfolios."
            />
        </div>
    );
}
