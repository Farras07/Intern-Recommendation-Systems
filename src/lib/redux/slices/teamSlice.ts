import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegistDataTypes } from '@/types/registDataTypes';
import { userData as UserDataType } from '@/types/UserTypes';

interface InitialStateInterface {
  teamData: UserDataType | null;
}

const initialState: InitialStateInterface = {
  teamData: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeamData: (state, action: PayloadAction<UserDataType>) => {
      state.teamData = action.payload;
    },
  },
});

export const { setTeamData } = teamSlice.actions;
export default teamSlice.reducer;
