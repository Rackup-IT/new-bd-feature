import { DBResponseSchema } from "@/features/admin-panel/validation/section/db_response";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalOverlayState {
  isOpen: boolean;
  sectionId: string | null;
  sectionToEdit: DBResponseSchema | null;
}

const initialState: ModalOverlayState = {
  isOpen: false,
  sectionId: null,
  sectionToEdit: null,
};

const ModalOverlaySlice = createSlice({
  name: "model-overlay",
  initialState,
  reducers: {
    openModalOverlay(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.sectionId = action.payload;
      state.sectionToEdit = null;
    },
    closeModalOverlay(state) {
      state.isOpen = false;
      state.sectionId = null;
      state.sectionToEdit = null;
    },
    openModalOverlayForAddSection(state) {
      state.isOpen = true;
      state.sectionToEdit = null;
      state.sectionId = null;
    },
    openModalOverlayForSectionEdit(
      state,
      action: PayloadAction<DBResponseSchema>
    ) {
      state.isOpen = true;
      state.sectionToEdit = action.payload;
      state.sectionId = null;
    },
  },
});

export default ModalOverlaySlice.reducer;
export const {
  closeModalOverlay,
  openModalOverlay,
  openModalOverlayForAddSection,
  openModalOverlayForSectionEdit,
} = ModalOverlaySlice.actions;
