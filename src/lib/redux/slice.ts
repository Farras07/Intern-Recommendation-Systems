import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RoleType = 'Admin' | 'Judge';

interface RoleState {
  value: RoleType;
}

const initialState: RoleState = {
  value: 'Admin',
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<RoleType>) => {
      state.value = action.payload;
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
