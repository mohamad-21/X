import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification, ITwitt } from "@/app/_lib/definitions";

interface AppState {
  twitts: ITwitt[] | [],
  isChangingRoute: boolean,
  notifications: INotification[]
}

const initialState: AppState = {
  twitts: [],
  isChangingRoute: false,
  notifications: [],
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTwitts(state, action: PayloadAction<ITwitt[]>) {
      state.twitts = action.payload;
    },
    setIsChangingRoute(state, action: PayloadAction<boolean>) {
      state.isChangingRoute = action.payload;
    },
    setNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications = action.payload;
    }
  }
})

export const { setTwitts, setIsChangingRoute, setNotifications } = appSlice.actions;

export default appSlice.reducer;