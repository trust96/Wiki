import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { ActionIcon, Group } from "@mantine/core";
import { WikiIcon } from "@/components/primitive";
import {
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type EditorState,
  type LexicalEditor,
} from "lexical";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { useEffect, useRef } from "react";
import { $createImageNode, ImageNode } from "./ImageNode";
import styles from "./WikiEditor.module.css";

export type TWikiEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onImageFile?: (file: File) => Promise<string>;
};

const theme = {
  paragraph: "wikiEditorParagraph",
};

const nodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  ImageNode,
];

const HtmlPlugin = ({ value }: { value: string }) => {
  const [editor] = useLexicalComposerContext();
  const didHydrate = useRef(false);

  useEffect(() => {
    if (didHydrate.current || !value) return;
    didHydrate.current = true;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      const parsed = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.select();
      $insertNodes(parsed);
    });
  }, [editor, value]);

  return null;
};

const Toolbar = ({
  onImageFile,
}: {
  onImageFile?: (file: File) => Promise<string>;
}) => {
  const [editor] = useLexicalComposerContext();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => false,
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const heading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const link = () => {
    const url = window.prompt("Link URL");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const image = async (file: File | null) => {
    if (!file) return;
    const src = onImageFile
      ? await onImageFile(file)
      : URL.createObjectURL(file);
    editor.update(() => {
      $insertNodes([$createImageNode(src, file.name)]);
    });
  };

  return (
    <Group className={styles.toolbar} gap="xs">
      <ActionIcon
        variant="subtle"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <WikiIcon name="format_bold" />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <WikiIcon name="format_italic" />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <WikiIcon name="format_underlined" />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
      >
        <WikiIcon name="strikethrough_s" />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={() => heading("h2")}>
        <WikiIcon name="title" />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        <WikiIcon name="format_list_bulleted" />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        <WikiIcon name="format_list_numbered" />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={link}>
        <WikiIcon name="link" />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={() => fileRef.current?.click()}>
        <WikiIcon name="image" />
      </ActionIcon>
      <input
        ref={fileRef}
        className={styles.hiddenFile}
        type="file"
        accept="image/*"
        onChange={(event) => {
          void image(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
    </Group>
  );
};

export const WikiEditor = ({
  value,
  onChange,
  onImageFile,
}: TWikiEditorProps) => {
  const handleChange = (state: EditorState, editor: LexicalEditor) => {
    state.read(() => {
      onChange($generateHtmlFromNodes(editor));
    });
  };

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "WikiEditor",
        theme,
        nodes,
        onError: (error) => {
          console.error(error);
        },
      }}
    >
      <div className={styles.frame}>
        <Toolbar onImageFile={onImageFile} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={styles.input} aria-label="Content" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <HtmlPlugin value={value} />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
};
