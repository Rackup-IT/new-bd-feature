import { Node, mergeAttributes } from "@tiptap/core";

export const createVideoNode = () =>
  Node.create({
    name: "video",
    group: "block",
    atom: true,
    selectable: true,
    addAttributes() {
      return {
        src: { default: null },
        allow: {
          default:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        },
        frameborder: { default: 0 },
        allowfullscreen: { default: true },
        class: { default: "w-full h-64" },
      };
    },
    parseHTML() {
      return [
        { tag: "div.video-embed-wrapper" },
        { tag: "iframe" },
        { tag: "video" },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      const src = HTMLAttributes.src || "";
      const isFile = /\.mp4(\?|$)/i.test(src);
      if (isFile) {
        return [
          "div",
          { class: "video-embed-wrapper" },
          [
            "video",
            { controls: "controls", class: HTMLAttributes.class || "w-full" },
            ["source", { src, type: "video/mp4" }],
          ],
        ];
      }

      return [
        "div",
        { class: "video-embed-wrapper" },
        [
          "iframe",
          mergeAttributes({
            src,
            frameborder: HTMLAttributes.frameborder,
            allow: HTMLAttributes.allow,
            allowfullscreen: HTMLAttributes.allowfullscreen
              ? "true"
              : undefined,
            class: HTMLAttributes.class,
          }),
        ],
      ];
    },
  });

export default createVideoNode;
