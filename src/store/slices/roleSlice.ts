import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/lib/dummy";

interface RoleState {
  activeRole: Role;
}

const initialState: RoleState = {
  activeRole: "patient",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<Role>) {
      state.activeRole = action.payload;
    },
  },
});

export const { setActiveRole } = roleSlice.actions;
export default roleSlice.reducer;