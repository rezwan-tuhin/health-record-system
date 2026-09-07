import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
}

interface UiState {
  sidebarCollapsed: boolean;
  toasts: Toast[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  toasts: [],
};

let toastCounter = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    pushToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      const id = `toast-${++toastCounter}`;
      state.toasts.push({ id, ...action.payload });
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { toggleSidebar, pushToast, dismissToast, clearToasts } =
  uiSlice.actions;
export default uiSlice.reducer;