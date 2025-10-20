import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecommendationType } from '@/types/RecommendationTypes';

type DataProps = {
  batch: string;
  recommendation: RecommendationType[];
};

interface FormState {
  data: DataProps;
}
const initialState: FormState = {
  data: {
    batch: '',
    recommendation: [],
  },
};

const shortlistCandidates = createSlice({
  name: 'roleVacancy',
  initialState,
  reducers: {
    setShortlistCandidate: (state, action: PayloadAction<DataProps>) => {
      state.data = action.payload;
    },
  },
});

export const { setShortlistCandidate } = shortlistCandidates.actions;
export default shortlistCandidates.reducer;
