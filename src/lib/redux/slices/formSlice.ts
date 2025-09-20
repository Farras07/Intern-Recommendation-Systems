import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StepAction =
  | { type: 'Next' }
  | { type: 'Back' }
  | { type: 'Reset' }
  | { type: 'Start' };

interface form {
  step: number;
  data: any;
}

const initialState: form = {
  step: 0,
  data: {},
};

const formQ = createSlice({
  name: 'formQ',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<StepAction>) => {
      if (action.payload.type === 'Start') state.step = 1;
      if (action.payload.type === 'Next') state.step = state.step + 1;
      if (action.payload.type === 'Back') state.step = state.step - 1;
      if (action.payload.type === 'Reset') state.step = 0;
    },
    setData: (state, action: PayloadAction<Partial<typeof state.data>>) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    setResetData: state => {
      state.data = {};
    },
  },
});

export const { setStep, setData, setResetData } = formQ.actions;
export default formQ.reducer;
