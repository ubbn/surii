import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "./store";

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
  extraReducers: (builder) => {
    builder.addCase(resetAction, () => {
      return initialState;
    });
  },
});

export default mainSlice.reducer;
export const { actionStart, actionFinish, actionFail } = mainSlice.actions;

// Reset states of all slices
const RESET_ACTION = "RESET";
export const resetAction = createAction(RESET_ACTION);
export const resetAll = (): AppThunk => {
  return (dispatch) => {
    dispatch({ type: RESET_ACTION });
  };
};
