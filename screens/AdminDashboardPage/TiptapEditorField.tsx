"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  TextQuote,
  type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type TiptapEditorFieldProps = {
  disabled?: boolean;
  error?: string;
  id: string;
  label: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  placeholder: string;
  required?: boolean;
  value?: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ToolbarButton = ({
  active = false,
  disabled = false,
  icon: Icon,
  label,
  onMouseDown,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-[14px] border transition-all duration-200",
        active
          ? "border-[#00adef] bg-[#00adef] text-white shadow-[0_12px_24px_rgba(0,173,239,0.28)] ring-4 ring-[#00adef]/15"
          : "border-[#dbe5f1] bg-white text-[#1d223f] hover:bg-[#f4f8fc]",
        disabled ? "cursor-not-allowed opacity-45" : "",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          active ? "scale-105" : "",
        )}
      />
    </button>
  );
};

export const TiptapEditorField = ({
  disabled = false,
  error,
  id,
  label,
  onBlur,
  onChange,
  placeholder,
  required = false,
  value = "",
}: TiptapEditorFieldProps) => {
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;
  const defaultEditorState = {
    isBlockquote: false,
    isBold: false,
    isBulletList: false,
    isItalic: false,
    isOrderedList: false,
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[190px] px-4 py-4 text-[15px] font-medium leading-[1.7] text-[#1d223f] outline-none",
      },
    },
    content: value,
    editable: !disabled,
    onBlur: () => {
      onBlur?.();
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.getHTML();

    if (value !== currentValue) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return defaultEditorState;
      }

      return {
        isBlockquote: currentEditor.isActive("blockquote"),
        isBold: currentEditor.isActive("bold"),
        isBulletList: currentEditor.isActive("bulletList"),
        isItalic: currentEditor.isActive("italic"),
        isOrderedList: currentEditor.isActive("orderedList"),
      };
    },
  }) ?? defaultEditorState;

  const runCommand =
    (command: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      command();
    };

  return (
    <div>
      <div id={labelId} className="text-[15px] font-semibold text-[#1d223f]">
        {label}
        {required ? <span className="text-[#1d223f]">*</span> : null}
      </div>

      <div
        className={cn(
          "admin-rich-editor mt-2 overflow-hidden rounded-[18px] border bg-[#f8fbff] transition-colors duration-200 focus-within:bg-white",
          error
            ? "border-[#dc2626] focus-within:border-[#dc2626]"
            : "border-[#dbe5f1] focus-within:border-[#00adef]",
        )}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-[#dbe5f1] bg-white/80 px-4 py-3">
          <ToolbarButton
            label="Bold"
            icon={Bold}
            disabled={!editor || disabled}
            active={editorState.isBold}
            onMouseDown={runCommand(() => {
              editor?.chain().focus().toggleBold().run();
            })}
          />
          <ToolbarButton
            label="Italic"
            icon={Italic}
            disabled={!editor || disabled}
            active={editorState.isItalic}
            onMouseDown={runCommand(() => {
              editor?.chain().focus().toggleItalic().run();
            })}
          />
          <ToolbarButton
            label="Bullet list"
            icon={List}
            disabled={!editor || disabled}
            active={editorState.isBulletList}
            onMouseDown={runCommand(() => {
              editor?.chain().focus().toggleBulletList().run();
            })}
          />
          <ToolbarButton
            label="Numbered list"
            icon={ListOrdered}
            disabled={!editor || disabled}
            active={editorState.isOrderedList}
            onMouseDown={runCommand(() => {
              editor?.chain().focus().toggleOrderedList().run();
            })}
          />
          <ToolbarButton
            label="Quote"
            icon={TextQuote}
            disabled={!editor || disabled}
            active={editorState.isBlockquote}
            onMouseDown={runCommand(() => {
              editor?.chain().focus().toggleBlockquote().run();
            })}
          />
        </div>

        <EditorContent
          id={id}
          editor={editor}
          aria-labelledby={labelId}
          aria-describedby={helperId}
        />
      </div>

      <p id={helperId} className="mt-2 text-[13px] leading-[1.6] text-[#7d89a4]">
        {error ??
          "Use the toolbar to format paragraphs, lists, and highlighted callouts."}
      </p>
    </div>
  );
};
