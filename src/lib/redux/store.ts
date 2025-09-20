import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './slices/roleSlice';
import formReducer from './slices/formSlice';
import roleVacancyReducer from './slices/roleVacancySlice';

export const store = configureStore({
  reducer: {
    role: roleReducer,
    form: formReducer,
    roleVacancyPick: roleVacancyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
