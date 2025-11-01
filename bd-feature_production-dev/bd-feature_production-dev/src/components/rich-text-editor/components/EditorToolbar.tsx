import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaCode,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaMagic,
  FaPaintBrush,
  FaQuoteRight,
  FaUnderline,
  FaVideo,
} from "react-icons/fa";
import {
  MdFormatColorText,
  MdLooks3,
  MdLooksOne,
  MdLooksTwo,
} from "react-icons/md";
import ToolbarButton from "./ToolbarButton";
import ToolbarDivider from "./ToolbarDivider";

interface EditorToolbarProps {
  editor: Editor;
  onAIImprove: () => void;
  onImageUploadClick: () => void;
  onVideoInsert: (url: string) => void;
}

const EditorToolbar = ({
  editor,
  onAIImprove,
  onImageUploadClick,
  onVideoInsert,
}: EditorToolbarProps) => {
  return (
    <div className="bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2">
      <div className="flex items-center gap-1">
        <ToolbarButton
          title="H1"
          icon={<MdLooksOne className="w-4 h-4" />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        />
        <ToolbarButton
          title="H2"
          icon={<MdLooksTwo className="w-4 h-4" />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarButton
          title="H3"
          icon={<MdLooks3 className="w-4 h-4" />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        />
      </div>

      <ToolbarDivider />

      <div className="flex items-center gap-1">
        <ToolbarButton
          title="Bold"
          icon={<FaBold className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        />
        <ToolbarButton
          title="Italic"
          icon={<FaItalic className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        />
        <ToolbarButton
          title="Underline"
          icon={<FaUnderline className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        />
        <ToolbarButton
          title="Highlight"
          icon={<FaPaintBrush className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
        />
        <ToolbarButton
          title="Text Color"
          icon={<MdFormatColorText className="w-4 h-4" />}
          onClick={() => {
            const color = window.prompt(
              "Enter hex color",
              editor.getAttributes("textStyle").color || "#000000"
            );
            if (color) editor.chain().focus().setColor(color).run();
          }}
        />
      </div>

      <ToolbarDivider />

      <div className="flex items-center gap-1">
        <ToolbarButton
          title="Bulleted list"
          icon={<FaListUl className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        />
        <ToolbarButton
          title="Numbered list"
          icon={<FaListOl className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        />
        <ToolbarButton
          title="Blockquote"
          icon={<FaQuoteRight className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        />
        <ToolbarButton
          title="Code block"
          icon={<FaCode className="w-4 h-4" />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        />
      </div>

      <ToolbarDivider />

      <div className="flex items-center gap-1">
        <ToolbarButton
          title="Insert link"
          icon={<FaLink className="w-4 h-4" />}
          onClick={() => {
            const prevHref = editor.getAttributes("link").href || "";
            const url = window.prompt("Enter URL", prevHref || "https://");
            if (url === null) return;
            const trimmed = url.trim();
            if (trimmed === "") {
              try {
                editor.chain().focus().unsetLink().run();
              } catch (err) {
                console.error("Failed to unset link:", err);
              }
              return;
            }

            const openInNew = window.confirm("Open in new tab?");
            const { from, to, empty } = editor.state.selection;
            try {
              if (empty) {
                const html = `<a href="${trimmed}" ${
                  openInNew ? 'target="_blank"' : ""
                }>${trimmed}</a>`;
                editor.chain().focus().insertContent(html).run();
              } else {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({
                    href: trimmed,
                    target: openInNew ? "_blank" : undefined,
                  })
                  .run();
              }
            } catch (err) {
              console.error(
                "Link command failed, fallback to inserting HTML:",
                err
              );
              const selected =
                editor.state.doc.textBetween(from, to) || trimmed;
              const html = `<a href="${trimmed}" ${
                openInNew ? 'target="_blank"' : ""
              }>${selected}</a>`;
              editor
                .chain()
                .focus()
                .deleteRange({ from, to })
                .insertContent(html)
                .run();
            }
          }}
        />
        <ToolbarButton
          title="Insert image"
          icon={<FaImage className="w-4 h-4" />}
          onClick={onImageUploadClick}
        />
        <ToolbarButton
          title="Insert image from URL"
          icon={<FaImage className="w-4 h-4" />}
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        />
        <ToolbarButton
          title="Insert video"
          icon={<FaVideo className="w-4 h-4" />}
          onClick={() => {
            const url = window.prompt("Enter video URL (YouTube/Vimeo/mp4):");
            if (url) onVideoInsert(url.trim());
          }}
        />
      </div>

      <div className="flex-1" />
      <div>
        <ToolbarButton
          title="AI Improve"
          icon={
            <>
              <FaMagic className="w-4 h-4" />
              <span className="text-xs">AI</span>
            </>
          }
          onClick={onAIImprove}
          className="bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center gap-2"
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
