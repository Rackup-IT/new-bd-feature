import { configureStore } from "@reduxjs/toolkit";

import ModalOverlaySlice from "./slice/modal_overlay_slice";
import SectionSlice from "./slice/section_slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      "model-overlay": ModalOverlaySlice,
      secion: SectionSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
