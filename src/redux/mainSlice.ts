import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type MainState = {
  loading?: boolean;
  error?: any;
};

const initialState: MainState = {};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    actionStart: (state: MainState) => {
      state.loading = true;
      state.error = undefined;
    },
    actionFinish: (state: MainState) => {
      state.loading = false;
    },
    actionFail: (state: MainState, action: PayloadAction<MainState>) => {
      state.error = action.payload?.error?.message;
      state.loading = false;
    },
  },
});

export default mainSlice.reducer;
export const { actionStart, actionFinish, actionFail } = mainSlice.actions;
