import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $getRoot } from "lexical";
import { useEffect } from "react";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import "./styles.css";
import ExampleTheme from "./themes/ExampleTheme";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = (value: string, editable: boolean): any => ({
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  editorState: () => $convertFromMarkdownString(value, TRANSFORMERS),
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
  editable,
});

function MyOnChangePlugin({ onChange, value }: { onChange: any, value: any }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // onChange(editorState);

      editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot();

        // console.log(root.__cachedText);
        const mdValue = $convertToMarkdownString(TRANSFORMERS, root);
        console.log(value, "<= || =>", mdValue);

        if (onChange && mdValue != "") {
          onChange(mdValue)
        }
      });

    });
  }, [editor, onChange]);

  useEffect(() => {
    editor.update(() => {
      // Get the RootNode from the EditorState
      const rootNode = $getRoot();

      // Create a new TextNode
      $convertFromMarkdownString(value, TRANSFORMERS, rootNode)
    });
  }, [value])

  return null;
}

type Props = {
  text?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  editorRef?: any,
  hideToolbar?: boolean;
  editable?: boolean
};

export default function Editor({
  text = "",
  onChange,
  editorRef,
  hideToolbar = false,
  editable = true,
}: Props) {
  function onTextChange(editorState: any) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const mdValue = $convertToMarkdownString(TRANSFORMERS, root);

      if (editorRef) {
        editorRef.current = mdValue;
      }
    });
  }

  return (
    <LexicalComposer initialConfig={editorConfig("", editable)}>
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
          <MyOnChangePlugin value={text} onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
