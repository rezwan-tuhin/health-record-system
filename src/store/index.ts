import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import roleReducer from "./slices/roleSlice";
import uiReducer from "./slices/uiSlice";
import walletReducer from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    role: roleReducer,
    ui: uiReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;