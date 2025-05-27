import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slices/imageSlice';

export const store = configureStore({
  reducer: {
    images: imageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;