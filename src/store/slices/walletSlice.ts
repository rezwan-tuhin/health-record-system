import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet(state, action: PayloadAction<{ address: string; chainId: number }>) {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.isConnected = true;
    },
    disconnectWallet(state) {
      state.address = null;
      state.isConnected = false;
      state.chainId = null;
    },
  },
});

export const { connectWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;