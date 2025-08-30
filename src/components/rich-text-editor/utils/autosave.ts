import { Editor } from "@tiptap/react";
import { useEffect } from "react";

export const useEditorAutosave = (
  editor: Editor | null | undefined,
  onEditorChange: (html: string) => void,
  value?: string
) => {
  useEffect(() => {
    if (!editor) return;
    const id =
      (window.location.pathname || "") + (window.location.search || "");
    let timer: number | undefined = undefined;

    const save = () => {
      try {
        const raw = editor.getJSON();
        localStorage.setItem(`rte-autosave:${id}`, JSON.stringify(raw));
        onEditorChange(editor.getHTML());
      } catch {
        // ignore
      }
    };

    const handler = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(save, 1500);
    };

    editor.on("update", handler);

    // restore if empty and local exists
    try {
      const saved = localStorage.getItem(`rte-autosave:${id}`);
      if (saved && (!value || value === "" || value === "<p></p>")) {
        const parsed = JSON.parse(saved);
        editor.commands.setContent(parsed);
      }
    } catch {
      // ignore
    }

    return () => {
      editor.off("update", handler);
      if (timer) window.clearTimeout(timer);
    };
  }, [editor, onEditorChange, value]);
};

export default useEditorAutosave;
