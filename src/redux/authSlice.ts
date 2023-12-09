import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { resetAction } from "./mainSlice";

export type AuthState = {
  isAuthenticated: boolean;
  name?: string;
  email?: string;
  profileUrl?: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state: AuthState, action: PayloadAction<AuthResponse>) => {
      const authData = action.payload;

      if (authData?.user) {
        state.isAuthenticated = true;
        state.name = authData.user.displayName;
        state.email = authData.user.email;
        state.profileUrl = authData.user.photoURL;
      } else {
        state = initialState;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAction, () => {
      return initialState;
    });
  },
});

export default authSlice.reducer;
export const { signIn } = authSlice.actions;
