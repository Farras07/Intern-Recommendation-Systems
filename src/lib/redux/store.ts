import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './slices/roleSlice';
import formReducer from './slices/formSlice';
import roleVacancyReducer from './slices/roleVacancySlice';
import registerVacancyReducer from './slices/registerSlice';

export const store = configureStore({
  reducer: {
    role: roleReducer,
    form: formReducer,
    roleVacancyPick: roleVacancyReducer,
    registerVacancy: registerVacancyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
