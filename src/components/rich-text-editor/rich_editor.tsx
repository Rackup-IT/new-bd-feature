"use client";

import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

// toolbar/icons removed — toolbar moved to components

import AIImprovementModal from "./components/AIImprovementModal";
import EditorStats from "./components/EditorStats";
import EditorToolbar from "./components/EditorToolbar";
import { createVideoNode, toEmbedUrl, useEditorAutosave } from "./utils";

import { useEffect, useState } from "react";
import { useAIImprove } from "../../hooks/useAIImprove";
import "./rich_editor.css";

const Tiptap = ({
  onEditorChange,
  value,
}: {
  onEditorChange: (value: string) => void;
  value: string | undefined;
}) => {
  const { improveText, isImproving, error } = useAIImprove();
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [improvedText, setImprovedText] = useState("");

  // Video node extension (moved to utils)
  const Video = createVideoNode();

  // (video node and helpers moved to utils)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Video,
      Link.configure({ openOnClick: false }),
      Underline,
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Color,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: true,
      }),
      Placeholder.configure({ placeholder: "Write something..." }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => onEditorChange(editor.getHTML()),
  });
  // Autosave handled by custom hook (moved to utils)
  useEditorAutosave(editor, onEditorChange, value);

  // Allow opening links with Ctrl/Cmd+click or middle-click inside the editor.
  useEffect(() => {
    if (!editor || !editor.view || !editor.view.dom) return;

    const dom = editor.view.dom as HTMLElement;

    const clickHandler = (ev: MouseEvent) => {
      try {
        const target = ev.target as HTMLElement | null;
        if (!target || !target.closest) return;
        const anchor = target.closest("a") as HTMLAnchorElement | null;
        if (!anchor) return;

        // Determine if user intends to open the link:
        // - Ctrl (Windows) or Meta (Mac) modifier
        // - Middle mouse button (button === 1)
        const isModifier = ev.ctrlKey || ev.metaKey || ev.button === 1;
        if (!isModifier) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        // Open securely in a new tab/window
        window.open(href, "_blank", "noopener,noreferrer");
        ev.preventDefault();
        ev.stopPropagation();
      } catch {
        // swallow errors to avoid breaking editor
        console.error("Editor link open handler error:");
      }
    };

    dom.addEventListener("click", clickHandler);
    return () => {
      dom.removeEventListener("click", clickHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  const handleAIImprove = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);

    if (!text.trim()) {
      alert("Please select some text to improve");
      return;
    }

    setSelectedText(text);
    setShowAIModal(true);
  };

  // (duplicate helper & node removed)

  const handleImproveConfirm = async () => {
    try {
      const improved = await improveText(selectedText);
      setImprovedText(improved);
    } catch (err) {
      console.error("Failed to improve text:", err);
    }
  };

  const handleApplyImprovement = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(improvedText)
      .run();
    setShowAIModal(false);
    setSelectedText("");
    setImprovedText("");
  };

  const handleCloseModal = () => {
    setShowAIModal(false);
    setSelectedText("");
    setImprovedText("");
  };

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <>
      <div className="grid grid-rows-[auto_1fr] h-full w-full min-h-0">
        <EditorToolbar
          editor={editor}
          onAIImprove={handleAIImprove}
          onImageUploadClick={() =>
            document.getElementById("image-upload")?.click()
          }
          onVideoInsert={(url) => {
            const embed = toEmbedUrl(url.trim());
            editor
              .chain()
              .focus()
              .insertContent({
                type: "video",
                attrs: { src: embed, class: "w-full h-64" },
              })
              .run();
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result) {
                  editor
                    .chain()
                    .focus()
                    .setImage({ src: reader.result as string })
                    .run();
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
          id="image-upload"
        />

        <EditorContent
          editor={editor}
          value={value}
          className="h-full border border-gray-200 overflow-auto p-4 bg-white"
        />
        <EditorStats
          wordCount={
            (editor.state.doc.textContent || "").trim()
              ? (editor.state.doc.textContent || "").trim().split(/\s+/).length
              : 0
          }
          readMinutes={Math.max(
            1,
            Math.round(
              ((editor.state.doc.textContent || "").trim()
                ? (editor.state.doc.textContent || "").trim().split(/\s+/)
                    .length
                : 0) / 200
            )
          )}
        />
      </div>

      {/* AI Improvement Modal */}
      {showAIModal && (
        <AIImprovementModal
          selectedText={selectedText}
          improvedText={improvedText}
          error={error}
          isImproving={isImproving}
          onImprove={handleImproveConfirm}
          onApply={handleApplyImprovement}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Tiptap;
