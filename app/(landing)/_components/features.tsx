"use client";

import { ArrowRight } from "lucide-react";
import { TrackedFeatureLink } from "./landing-analytics";

const features = [
  {
    title: "Write and organize",
    subtitle: "Your thoughts, your way",
    href: "/features/editor",
    description:
      "A powerful block-based editor that adapts to how you think. Create documents, take notes, and build your personal knowledge base—all in one place.",
    highlights: ["Block-based editor", "Nested pages", "Custom icons"],
    mockup: (
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        {/* Document with toolbar - matches toolbar.tsx */}
        <div className="p-6">
          {/* Icon */}
          <div className="mb-2 text-5xl">📝</div>
          {/* Title - matches the 5xl bold style */}
          <div className="mb-4 text-4xl font-bold text-[#3F3F3F] dark:text-[#CFCFCF]">
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
    ),
  },
  {
    title: "Meet your AI Squad",
    subtitle: "AI coworkers that get things done",
    href: "/features/squad",
    description:
      "Create custom AI coworkers with role-specific instructions. Chat with your squad, and they'll write documents, research your workspace, and organize your notes — all using your own API key.",
    highlights: ["Custom agents", "Workspace tools", "Multi-model (GPT / Claude / Gemini)", "File & context aware"],
    mockup: (
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
    ),
  },
  {
    title: "Write faster with AI",
    subtitle: "Your creative superpower",
    href: "/features/ai-writing",
    description:
      "Generate content, brainstorm ideas, and improve your writing directly in your documents. Bring your own API key for complete control and privacy.",
    highlights: ["BYOK (OpenAI)", "Inline generation", "Chat with page"],
    mockup: (
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
    ),
  },
  {
    title: "Find anything instantly",
    subtitle: "Search that just works",
    href: "/features/search",
    description:
      "Never lose a thought again. Press ⌘K to quickly search and find any document in seconds, no matter how large your workspace grows.",
    highlights: ["⌘K shortcut", "Instant results", "Document icons"],
    mockup: (
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
    ),
  },
  {
    title: "All your files in one place",
    subtitle: "Centralized media and storage",
    href: "/features/files",
    description:
      "Every image, video, and file you upload to Noted is automatically organized into a beautiful masonry gallery. Keep track of your storage and find assets instantly.",
    highlights: ["Masonry gallery", "Storage quotas", "Visual previews"],
    mockup: (
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        {/* Files App UI */}
        <div className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold dark:text-neutral-100">Files</h3>
            <div className="w-24 sm:w-32 space-y-1.5">
              <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
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
            {/* Image File */}
            <div className="group relative overflow-hidden rounded-lg border bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop"
                alt="Architecture"
                className="h-24 w-full object-cover sm:h-32"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white flex flex-col justify-end">
                <span className="truncate text-xs font-medium">hero-bg.jpg</span>
                <span className="text-[10px] text-white/80">2.4 MB</span>
              </div>
            </div>

            {/* Doc File */}
            <div className="group relative overflow-hidden rounded-lg border bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
              <div className="flex h-24 sm:h-32 w-full items-center justify-center">
                <span className="text-3xl text-neutral-300 dark:text-neutral-600">📄</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2 backdrop-blur-sm dark:bg-neutral-900/95 border-t dark:border-neutral-700">
                <span className="block truncate text-xs font-medium dark:text-neutral-200">contract.pdf</span>
                <span className="block text-[10px] text-muted-foreground">845 KB</span>
              </div>
            </div>

            {/* Video File */}
            <div className="group relative overflow-hidden rounded-lg border bg-neutral-900 hidden sm:block">
              <div className="flex h-32 w-full items-center justify-center">
                <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white flex flex-col justify-end">
                <span className="truncate text-xs font-medium">demo-recording.mp4</span>
                <span className="text-[10px] text-white/80">14.2 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Share with the world",
    subtitle: "Publish in one click",
    href: "/features/publish",
    description:
      "Turn any document into a public page. Share your notes, guides, or portfolio with a simple link—no coding required.",
    highlights: ["Public pages", "Shareable links", "Real-time updates"],
    mockup: (
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
    ),
  },
];

export const Features = () => {
  return (
    <section className="w-full py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-10 py-16 md:gap-14 lg:flex-row lg:gap-20 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } ${index !== features.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {feature.subtitle}
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
                  {feature.title}
                </h2>
              </div>
              <p className="text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {feature.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <TrackedFeatureLink
                href={feature.href}
                featureName={feature.title}
                destinationPath={feature.href}
                className="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span className="font-medium">Learn more</span>
                <ArrowRight className="h-4 w-4" />
              </TrackedFeatureLink>
            </div>

            {/* Mockup */}
            <div className="flex-1 w-full max-w-xl sm:max-w-2xl lg:max-w-none">{feature.mockup}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
