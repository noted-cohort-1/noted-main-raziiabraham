"use client";

import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  DefaultReactSuggestionItem,
  useDictionary,
  FormattingToolbar,
  FormattingToolbarController,
  getFormattingToolbarItems,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  AIExtension,
  getAISlashMenuItems,
  AIMenuController,
  AIToolbarButton,
} from "@blocknote/xl-ai";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/clerk-react";
import { ServerSideTransport } from "@/lib/serverSideTransport";

import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import "@blocknote/xl-ai/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

/**
 * Slash menu component with AI integration.
 * Uses built-in BlockNote AI items that integrate with AIMenuController.
 */
const SlashMenuWithAI = ({
  editor,
  hasAiConfig,
}: {
  editor: BlockNoteEditor;
  hasAiConfig: boolean;
}) => {
  const dictionary = useDictionary();

  // Inject AI dictionary into editor when context is available
  useEffect(() => {
    if (dictionary && editor) {
      (editor as any).dictionary = {
        ...(editor as any).dictionary,
        ...dictionary,
        ai: aiEn,
      };
    }
  }, [dictionary, editor]);

  const getMenuItems = useCallback(
    async (query: string): Promise<DefaultReactSuggestionItem[]> => {
      const defaultItems = getDefaultReactSlashMenuItems(editor);
      const aiItems = hasAiConfig ? getAISlashMenuItems(editor) : [];

      // Use BlockNote's built-in filter function
      return filterSuggestionItems([...aiItems, ...defaultItems], query);
    },
    [editor, hasAiConfig],
  );

  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={getMenuItems}
    />
  );
};

/**
 * BlockNote Editor with AI integration.
 * Uses BlockNote xl-ai with server-side API key management via Convex.
 */
const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const { isAuthenticated } = useConvexAuth();
  const { getToken } = useAuth();

  // Reactive query: UI updates immediately when settings change
  const aiSettings = useQuery(
    api.aiSettings.getSettings,
    isAuthenticated ? {} : "skip"
  );
  const hasAiConfig = !!aiSettings;

  // File upload handler
  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  // Transport for AI requests (sends to our API route)
  const aiTransport = useMemo(() => {
    return new ServerSideTransport(async () => {
      const token = await getToken({ template: "convex" });
      if (!token) throw new Error("Not authenticated");
      return token;
    });
  }, [getToken]);

  // Create editor with AI extension
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
    extensions: [
      AIExtension({
        transport: aiTransport,
        agentCursor: { name: "AI", color: "#8bc6ff" },
      }),
    ],
  });

  // Debounce updates to avoid spamming the database
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorChange = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      onChange(JSON.stringify(editor.document, null, 2));
    }, 1000);
  }, [editor, onChange]);

  return (
    <div>
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
        slashMenu={false}
        formattingToolbar={false}
      >
        <SlashMenuWithAI editor={editor} hasAiConfig={hasAiConfig} />
        <FormattingToolbarWithAI hasAiConfig={hasAiConfig} />
        {hasAiConfig && <AIMenuController />}
      </BlockNoteView>
    </div>
  );
};

function FormattingToolbarWithAI({ hasAiConfig }: { hasAiConfig: boolean }) {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {getFormattingToolbarItems()}
          {hasAiConfig && <AIToolbarButton />}
        </FormattingToolbar>
      )}
    />
  );
}

export default Editor;
