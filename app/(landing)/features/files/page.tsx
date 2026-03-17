import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileIcon, Image as ImageIcon, VideoIcon } from "lucide-react";
import { FeatureCTA } from "../../_components/feature-cta";

export default function FilesFeaturePage() {
    return (
        <div className="flex flex-col items-center pb-24">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
                <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                        CENTRALIZED STORAGE
                    </span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                    All your files in one place.
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
                    Every image, video, and PDF you upload to Noted is automatically organized into a beautiful masonry gallery. Keep track of your storage quotas and find media instantly.
                </p>

                {/* Honest mockup matching landing page */}
                <div className="mx-auto mt-16 max-w-2xl w-full text-left">
                    <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                        {/* Files App UI */}
                        <div className="p-4 sm:p-6 sm:pb-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-bold dark:text-neutral-100">Files</h3>
                                <div className="w-32 space-y-1.5">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>124 MB used</span>
                                        <span>40%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div className="h-full bg-blue-600 dark:bg-blue-500" style={{ width: "40%" }} />
                                    </div>
                                </div>
                            </div>

                            {/* Masonry Grid Mockup */}
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {/* Image File 1 */}
                                <div className="group relative overflow-hidden rounded-lg border bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                                    <img
                                        src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop"
                                        alt="Architecture"
                                        className="h-28 w-full object-cover sm:h-36"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white flex flex-col justify-end">
                                        <span className="truncate text-xs font-medium">hero-bg.jpg</span>
                                        <span className="text-[10px] text-white/80">2.4 MB</span>
                                    </div>
                                </div>

                                {/* Doc File */}
                                <div className="group relative overflow-hidden rounded-lg border bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
                                    <div className="flex h-28 sm:h-36 w-full items-center justify-center">
                                        <span className="text-3xl text-neutral-300 dark:text-neutral-600">📄</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2 backdrop-blur-sm dark:bg-neutral-900/95 border-t dark:border-neutral-700">
                                        <span className="block truncate text-xs font-medium dark:text-neutral-200">contract.pdf</span>
                                        <span className="block text-[10px] text-muted-foreground">845 KB</span>
                                    </div>
                                </div>

                                {/* Video File */}
                                <div className="group relative overflow-hidden rounded-lg border bg-neutral-900 hidden sm:block">
                                    <div className="flex h-36 w-full items-center justify-center">
                                        <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white flex flex-col justify-end">
                                        <span className="truncate text-xs font-medium">demo-recording.mp4</span>
                                        <span className="text-[10px] text-white/80">14.2 MB</span>
                                    </div>
                                </div>

                                {/* Doc File 2 (Mobile only to replace hidden video) */}
                                <div className="group relative overflow-hidden rounded-lg border bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 sm:hidden">
                                    <div className="flex h-28 w-full items-center justify-center">
                                        <span className="text-3xl text-neutral-300 dark:text-neutral-600">📊</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2 backdrop-blur-sm dark:bg-neutral-900/95 border-t dark:border-neutral-700">
                                        <span className="block truncate text-xs font-medium dark:text-neutral-200">Q3_budget.csv</span>
                                        <span className="block text-[10px] text-muted-foreground">12 KB</span>
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
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Masonry Gallery</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Every image you paste into a document is automatically aggregated into a beautiful, pinterest-style masonry layout so you can easily browse your visual assets.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <VideoIcon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Video & File Support</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Upload videos up to 50MB and embed any file type directly into your pages. Noted handles the hosting via Edgestore seamlessly in the background.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <FileIcon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Quota Tracking</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Always know exactly how much space you have left. The built-in quota tracker elegantly displays your real-time storage usage and total allowance limits.
                        </p>
                    </div>
                </div>
            </div>

            <FeatureCTA
                headline="Stop losing your uploads."
                subheadline="Join thousands of people who use Noted to build their second brain and keep all their files organized automatically."
            />
        </div>
    );
}
