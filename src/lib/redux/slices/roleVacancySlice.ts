import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormVacancyItemType } from '@/types/OpenVacancyTypes';

interface FormState {
  data: FormVacancyItemType[]; // ✅ array of items, not tuple
}
const initialState: FormState = {
  data: [], // start empty
};

const roleVacancy = createSlice({
  name: 'roleVacancy',
  initialState,
  reducers: {
    setPushRoleVacancy: (state, action: PayloadAction<FormVacancyItemType>) => {
      state.data.push(action.payload);
    },
    setResetRoleVacancy: state => {
      state.data = [];
    },
  },
});

export const { setPushRoleVacancy, setResetRoleVacancy } = roleVacancy.actions;
export default roleVacancy.reducer;
