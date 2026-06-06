"use client";

import type { ReactNode } from "react";
import type { Components } from "react-markdown";

/** Tool results surfaced in coworker UI tool chips. */
export interface CoworkerToolResult {
  count?: number;
  results?: unknown[];
  message?: string;
  documents?: unknown[];
}

/** Persisted + streaming message parts (includes legacy reasoning field). */
export interface CoworkerMessagePart {
  type: string;
  text?: string;
  reasoning?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  result?: CoworkerToolResult;
  state?: string;
  output?: unknown;
  input?: unknown;
  image?: string;
  data?: string;
  mimeType?: string;
  url?: string;
}

export interface SquadAgentSelection {
  _id: string;
  name?: string;
  description?: string;
  icon?: string;
}

type MarkdownElementProps = {
  children?: ReactNode;
};

export const coworkerMarkdownComponents: Components = {
  p: ({ children }: MarkdownElementProps) => (
    <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
  ),
  ul: ({ children }: MarkdownElementProps) => (
    <ul className="mb-2 list-disc space-y-1 pl-4">{children}</ul>
  ),
  ol: ({ children }: MarkdownElementProps) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4">{children}</ol>
  ),
  li: ({ children }: MarkdownElementProps) => (
    <li className="pl-1">{children}</li>
  ),
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-2 mt-4 text-lg font-bold">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mb-2 mt-3 text-base font-bold">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mb-1 mt-2 text-sm font-bold">{children}</h3>
  ),
  blockquote: ({ children }: MarkdownElementProps) => (
    <blockquote className="my-2 border-l-2 border-muted pl-3 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  pre: ({ children }: MarkdownElementProps) => (
    <pre className="my-2 overflow-x-auto rounded-md bg-muted/50 p-2 font-mono text-xs">
      {children}
    </pre>
  ),
  code: ({
    inline,
    children,
    ...props
  }: {
    inline?: boolean;
    children?: ReactNode;
  }) =>
    inline ? (
      <code
        className="whitespace-pre-wrap break-all rounded bg-muted px-1 py-0.5 font-mono text-[11px]"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className="block whitespace-pre font-mono text-xs" {...props}>
        {children}
      </code>
    ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="my-2 overflow-x-auto">
      <table className="min-w-full divide-y divide-border rounded-md border text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: MarkdownElementProps) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }: MarkdownElementProps) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }: MarkdownElementProps) => <tr>{children}</tr>,
  th: ({ children }: MarkdownElementProps) => (
    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="px-3 py-2">{children}</td>
  ),
};

export function getCoworkerToolDisplayName(
  toolName: string,
  result?: CoworkerToolResult,
  state?: string,
): string {
  const isDone = state === "result" || result !== undefined;

  switch (toolName) {
    case "searchWorkspace":
      if (!isDone) return "Searching...";
      return `Found ${result?.count ?? result?.results?.length ?? 0} result(s)`;
    case "readDocument":
      return isDone ? "Read 1 document(s)" : "Reading document...";
    case "writeDocument":
      return isDone
        ? (result?.message ?? "Content created")
        : "Creating content...";
    case "editDocument":
      return isDone ? "Updated document" : "Editing document...";
    case "listDocuments":
      if (!isDone) return "Listing documents...";
      return `Found ${result?.count ?? result?.documents?.length ?? 0} document(s)`;
    default:
      return toolName;
  }
}
