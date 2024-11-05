import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITwitt, SignupData, User, UserData, UserFollowingsAndFollowers } from "@/app/_lib/definitions";

export type SignupSlice = {
  data: SignupData | null,
  step: 1 | 2 | 3 | 4 | 5 | 6,
}

export type LoginSlice = {
  email_username: string | null,
  step: 1 | 2
}


interface UserState {
  signup: SignupSlice
  login: LoginSlice,
  user: UserData & { created_at: string, updated_at: string } | null,
  replyTo: ITwitt | null
}

const initialState: UserState = {
  signup: {
    data: null,
    step: 1
  },
  login: {
    email_username: null,
    step: 1
  },
  user: null,
  replyTo: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSignupData(state, action: PayloadAction<SignupSlice>) {
      state.signup = action.payload;
    },
    setLoginData(state, action: PayloadAction<LoginSlice>) {
      state.login = action.payload;
    },
    setUserData(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload;
    },
  }
})

export const { setLoginData, setSignupData, setUserData } = userSlice.actions;

export default userSlice.reducer;