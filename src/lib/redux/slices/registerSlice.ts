import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegistDataTypes } from '@/types/registDataTypes';

interface InitialStateInterface {
  currentApplyId: string;
  regisData: RegistDataTypes | null;
}

const initialState: InitialStateInterface = {
  currentApplyId: '',
  regisData: null,
};

const registerSlice = createSlice({
  name: 'registerSlice',
  initialState,
  reducers: {
    setCurrentApplyId: (state, action: PayloadAction<string>) => {
      state.currentApplyId = action.payload;
    },
    setRegisData: (state, action: PayloadAction<RegistDataTypes>) => {
      state.regisData = action.payload;
    },
  },
});

export const { setCurrentApplyId, setRegisData } = registerSlice.actions;
export default registerSlice.reducer;
