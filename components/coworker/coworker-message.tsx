"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  coworkerMarkdownComponents,
  getCoworkerToolDisplayName,
  type CoworkerMessagePart,
  type CoworkerToolResult,
} from "@/lib/coworker-message-ui";
import { useCoworkerConfig } from "@/hooks/use-coworker-config";
import {
  ChevronRight,
  CheckCircle2,
  Loader2,
  Search,
  FileText,
  PenLine,
  FolderOpen,
  Lightbulb,
  Edit3,
  Paperclip,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CoworkerMessageProps {
  role: "user" | "assistant";
  content: string;
  parts: CoworkerMessagePart[];
  isStreaming?: boolean;
}

// Render a single part
function renderPart(
  part: CoworkerMessagePart,
  index: number,
  isStreaming: boolean,
  isLastReasoningPart: boolean,
) {
  const key = `part-${index}`;

  // Text part
  if (part.type === "text" && part.text) {
    return (
      <div
        key={key}
        className="bg-transparent px-0 py-1 text-sm leading-relaxed text-foreground"
      >
        <div className="prose-sm dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={coworkerMarkdownComponents}
          >
            {part.text}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  // Reasoning part
  if (part.type === "reasoning") {
    const reasoningText = part.reasoning || part.text || "";

    // Extract dynamic header from reasoning
    const getReasoningHeader = () => {
      if (!reasoningText) return "Thinking...";
      if (isStreaming && isLastReasoningPart) {
        const matches = [...reasoningText.matchAll(/\*\*(.*?)\*\*/g)];
        if (matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          if (lastMatch && lastMatch[1]) {
            return lastMatch[1].trim();
          }
        }
        return "Thinking...";
      }
      return "Thought";
    };

    return (
      <ReasoningSection
        key={key}
        header={getReasoningHeader()}
        content={reasoningText}
        isStreaming={isStreaming && isLastReasoningPart}
      />
    );
  }

  // Tool call parts
  if (
    part.type === "tool-call" ||
    part.type === "tool-invocation" ||
    part.type?.startsWith("tool-")
  ) {
    const toolName = part.toolName || part.type.replace("tool-", "");
    const result = (part.result || part.output) as
      | CoworkerToolResult
      | undefined;
    const state = part.state || (result !== undefined ? "result" : "call");
    const isDone = state === "result" || result !== undefined;

    return (
      <div key={key} className="w-full py-0.5">
        <div className="flex select-none items-center gap-2 pl-0.5 text-xs text-muted-foreground">
          {!isDone && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground/70" />
          )}
          <span
            className={cn(
              "text-[12px] font-medium",
              !isDone ? "opacity-90" : "opacity-70",
            )}
          >
            {getCoworkerToolDisplayName(toolName, result, state)}
          </span>
        </div>
      </div>
    );
  }

  // Step start parts (can show as a subtle indicator)
  if (part.type === "step-start") {
    return null; // Or render a subtle divider if desired
  }

  return null;
}

// Collapsible reasoning section component
function ReasoningSection({
  header,
  content,
  isStreaming,
}: {
  header: string;
  content: string;
  isStreaming: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex select-none items-center gap-1.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        disabled={!content}
      >
        <span
          className={cn(
            "flex items-center gap-1 text-[12px] font-medium",
            isStreaming ? "opacity-90" : "opacity-70",
          )}
        >
          {header === "Thinking..." ? (
            <>
              Thinking
              <span className="flex gap-0.5">
                <span className="animate-bounce [animation-delay:0ms] [animation-duration:1.4s]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:200ms] [animation-duration:1.4s]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:400ms] [animation-duration:1.4s]">
                  .
                </span>
              </span>
            </>
          ) : (
            header
          )}
        </span>
        {content && (
          <ChevronRight
            className={cn(
              "h-3 w-3 opacity-50 transition-transform",
              isExpanded && "rotate-90",
            )}
          />
        )}
      </button>

      {isExpanded && content && (
        <div className="my-1 ml-1 border-l-2 border-muted/30 pl-4 text-xs text-muted-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={coworkerMarkdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export function CoworkerMessage({
  role,
  content,
  parts,
  isStreaming,
}: CoworkerMessageProps) {
  const isUser = role === "user";
  const { isExpanded } = useCoworkerConfig();

  // For user messages, render content directly
  if (isUser) {
    let displayContent = content;

    // 1. Strip Context Block
    const contextRegex = /^\s*\[Context:[\s\S]*?answering:\]([\s\S]*?)\n\n/;
    const contextMatch = displayContent.match(contextRegex);
    displayContent = displayContent.replace(contextRegex, "");

    // 2. File Attachments
    const fileRegex = /\[File: (.*?)\]\((.*?)\)\n*/g;
    const attachedFiles: { name: string; url: string }[] = [];
    const fileMatches = [...displayContent.matchAll(fileRegex)];
    fileMatches.forEach((m) => {
      if (m[1] && m[2]) attachedFiles.push({ name: m[1], url: m[2] });
    });
    displayContent = displayContent.replace(fileRegex, "");

    // 3. System Time Block
    const systemRegex = /\[System: Local Time:[\s\S]*?\]\n*/g;
    displayContent = displayContent.replace(systemRegex, "");

    displayContent = displayContent.trim();

    // Extract Context Titles
    const contextTitles: string[] = [];
    if (contextMatch && contextMatch[1]) {
      const matches = [...contextMatch[1].matchAll(/- (.*?) \(ID:/g)];
      matches.forEach((m) => {
        if (m[1]) contextTitles.push(m[1].trim());
      });
    }

    return (
      <div className="flex w-full justify-end gap-2">
        <div className="flex max-w-[85%] flex-col items-end gap-1.5">
          {displayContent && (
            <div
              className={cn(
                "rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm leading-relaxed",
                isExpanded
                  ? "bg-white text-foreground shadow-sm dark:bg-zinc-800"
                  : "bg-muted/80 text-foreground",
              )}
            >
              <div className="whitespace-pre-wrap break-words">
                {displayContent}
              </div>
            </div>
          )}

          {/* Render Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="mt-0.5 flex flex-wrap justify-end gap-1.5">
              {attachedFiles.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex max-w-[140px] select-none items-center gap-1 rounded-full border bg-secondary/80 px-2 py-0.5 text-[10px] text-secondary-foreground opacity-80 transition-opacity hover:underline hover:opacity-100"
                >
                  <Paperclip className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
                  <span className="truncate">{file.name}</span>
                </a>
              ))}
            </div>
          )}

          {/* Render Context Docs */}
          {contextTitles.length > 0 && (
            <div className="mt-0.5 flex flex-wrap justify-end gap-1.5">
              {contextTitles.map((title, i) => (
                <div
                  key={i}
                  className="flex max-w-[140px] select-none items-center gap-1 rounded-full border bg-secondary/80 px-2 py-0.5 text-[10px] text-secondary-foreground opacity-80 transition-opacity hover:opacity-100"
                >
                  <FileText className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
                  <span className="truncate">{title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // For assistant messages, render parts in order
  // Find the last reasoning part index for streaming indicator
  let lastReasoningIndex = -1;
  parts.forEach((part, i) => {
    if (part.type === "reasoning") {
      lastReasoningIndex = i;
    }
  });

  // If no parts but has content, create a text part
  const effectiveParts =
    parts.length > 0 ? parts : content ? [{ type: "text", text: content }] : [];

  // Show thinking placeholder if streaming with no content yet
  const showThinkingPlaceholder = isStreaming && effectiveParts.length === 0;

  return (
    <div className="flex w-full justify-start gap-2">
      <div className="flex w-full flex-col gap-1.5 pr-1">
        {showThinkingPlaceholder && (
          <ReasoningSection
            header="Thinking..."
            content=""
            isStreaming={true}
          />
        )}

        {effectiveParts.map((part, index) =>
          renderPart(
            part,
            index,
            isStreaming || false,
            index === lastReasoningIndex,
          ),
        )}
      </div>
    </div>
  );
}
