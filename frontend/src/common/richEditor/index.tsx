import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $getRoot } from "lexical";
import React from "react";
import RichEditorAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import TableActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizerPlugin from "./plugins/TableCellResizer";
import TableHoverActionsPlugin from "./plugins/TableHoverActionsPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import "./styles.css";
import RichEditorTheme from "./themes/RichEditorTheme";
import { RICH_EDITOR_TRANSFORMERS } from "./transformers";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = (value: string): any => ({
  // The editor theme
  theme: RichEditorTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  editorState: () => $convertFromMarkdownString(value, RICH_EDITOR_TRANSFORMERS),
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
});

function MyOnChangePlugin({ onChange, value, editable }: { onChange: any, value: any, editable: boolean }) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const mdValue = $convertToMarkdownString(RICH_EDITOR_TRANSFORMERS, root);

        if (onChange && mdValue != "") {
          onChange(mdValue)
        }
      });
    });
  }, [editor, onChange]);

  React.useEffect(() => {
    editor.update(() => {
      const rootNode = $getRoot();
      $convertFromMarkdownString(value, RICH_EDITOR_TRANSFORMERS, rootNode)
    });
  }, [value])

  React.useEffect(() => {
    editor.setEditable(editable)
  }, [editor, editable])

  return null;
}

function TablePlugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    React.useState<HTMLDivElement | null>(null);

  const onRef = (rootElement: HTMLDivElement | null) => {
    if (rootElement !== null) {
      setFloatingAnchorElem(rootElement);
    }
  };

  return (
    <>
      <div ref={onRef} className="editor-table-anchor" />
      <TablePlugin />
      {floatingAnchorElem && (
        <>
          <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
          <TableCellResizerPlugin />
          <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        </>
      )}
    </>
  );
}

type Props = {
  text?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  editorRef?: any,
  hideToolbar?: boolean;
  editable?: boolean
};

export default function RichEditor({
  text = "",
  onChange,
  editorRef,
  hideToolbar = false,
  editable = true,
}: Props) {
  function onTextChange(editorState: any) {
    editorState.read(() => {
      const root = $getRoot();
      const mdValue = $convertToMarkdownString(RICH_EDITOR_TRANSFORMERS, root);

      if (editorRef) {
        editorRef.current = mdValue;
      }
    });
  }

  return (
    <LexicalComposer initialConfig={editorConfig("")}>
      <div className="editor-container">
        {!hideToolbar && <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={onTextChange}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <MyOnChangePlugin value={text} onChange={onChange} editable={editable} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <RichEditorAutoLinkPlugin />
          <TablePlugins />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={RICH_EDITOR_TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
