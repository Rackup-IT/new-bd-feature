import PostModel from "@/interfaces/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum SidePanelButtons {
  HOME = "home",
  ADD = "add",
  POSTS = "posts",
  NAVIGATIONS = "navigations",
  ACCOUNT = "account",
}

interface AdminState {
  selectedTab: string;
  isEditPost?: boolean;
  post?: PostModel | null;
}

const initState: AdminState = {
  selectedTab: SidePanelButtons.HOME,
  isEditPost: false,
  post: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setIsEditPost: (state, action: PayloadAction<AdminState>) => {
      state.selectedTab = action.payload.selectedTab;
      state.isEditPost = action.payload.isEditPost;
      state.post = action.payload.post;

      console.log("Post" + action.payload.post?.slug);
    },
    setCloseIsEditPost: (state) => {
      state.isEditPost = false;
      state.post = null;
    },
  },
});

export default adminSlice.reducer;
export const { setSelectedTab, setIsEditPost, setCloseIsEditPost } =
  adminSlice.actions;
