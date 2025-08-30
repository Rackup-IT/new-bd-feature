import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBResponseSchema } from "../../features/admin-panel/validation/blog/db_response";

export interface Section {
  _id: string;
  title?: string;
  uploadedAt: string;
  posts: DBResponseSchema[];
  hightlightPost?: boolean;
}

interface SectionState {
  list: Section[];
  status: "idle" | "loading" | "succeeded";
}

const initialState: SectionState = {
  list: [],
  status: "idle",
};

const SectionSlice = createSlice({
  name: "section-slice",
  initialState,
  reducers: {
    setSectionLoading(state) {
      state.list = [];
      state.status = "loading";
    },
    addSection(state, action: PayloadAction<Omit<Section, "posts">>) {
      state.list.push({ ...action.payload, posts: [], hightlightPost: true });
    },

    addPostToSection(
      state,
      action: PayloadAction<{ sectionId: string; posts: DBResponseSchema[] }>
    ) {
      const { posts, sectionId } = action.payload;
      const sec = state.list.find((s) => s._id === sectionId);
      if (sec) {
        sec.posts.push(...posts);
      }
    },

    removePostFromSection(
      state,
      action: PayloadAction<{
        sectionId: string;
        postId?: string;
        postIndex?: number;
      }>
    ) {
      const { postId, sectionId, postIndex } = action.payload;
      const sec = state.list.find((s) => s._id === sectionId);
      if (sec) {
        if (postId) {
          sec.posts = sec.posts.filter((p) => p && p._id !== postId);
        } else if (postIndex !== undefined) {
          sec.posts.splice(postIndex, 1);
        }
      }
    },

    reoderSections(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const [moved] = state.list.splice(from, 1);
      state.list.splice(to, 0, moved);
    },

    removeSection(state, action: PayloadAction<string>) {
      state.list = state.list.filter((s) => s._id !== action.payload);
    },

    toggleHightlightPost(state, action: PayloadAction<string>) {
      const sec = state.list.find((s) => s._id === action.payload);
      if (sec) {
        sec.hightlightPost = !sec.hightlightPost;
      }
    },

    makePostHightlight(
      state,
      action: PayloadAction<{ sectinonId: string; replaceIdx: number }>
    ) {
      const { sectinonId, replaceIdx } = action.payload;
      const sec = state.list.find((s) => s._id === sectinonId);
      if (!sec) return;

      const len = sec.posts.length;
      if (len === 0 || replaceIdx < 0 || replaceIdx >= len) return;
      const [post] = sec!.posts.splice(replaceIdx, 1);
      sec!.posts.splice(0, 0, post);
    },

    changeSectionTitle(
      state,
      action: PayloadAction<{ id: string; title: string | null }>
    ) {
      const { id, title } = action.payload;
      const sec = state.list.find((s) => s._id === id);
      if (sec) {
        sec.title = title || "";
      }
    },
    addSectionListFromDB(state, action: PayloadAction<Section[]>) {
      state.list = action.payload;
      state.status = "succeeded";
    },
  },
});

export default SectionSlice.reducer;
export const {
  addPostToSection,
  addSection,
  removePostFromSection,
  reoderSections,
  makePostHightlight,
  toggleHightlightPost,
  removeSection,
  changeSectionTitle,
  addSectionListFromDB,
  setSectionLoading,
} = SectionSlice.actions;
