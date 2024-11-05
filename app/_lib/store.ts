import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/app/_lib/slices/userSlice';
import appReducer from '@/app/_lib/slices/appSlice';

export const store = () => (
  configureStore({
    reducer: {
      user: userReducer,
      app: appReducer
    },
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: false
      })
    },
  })
)

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];