import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type periodState = {
  periodIndex: number | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const initialState: periodState = {
  periodIndex: undefined,
  startDate: undefined,
  endDate: undefined,
};

const periodSlice = createSlice({
  name: "periods",
  initialState: initialState,
  reducers: {
    setPeriodIndex: (state, action: PayloadAction<any>) => {
      state.periodIndex = action.payload;
    },
    setStartDateRedux: (state, action: PayloadAction<any>) => {
      state.startDate = action.payload;
    },
    setEndtDateRedux: (state, action: PayloadAction<any>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setPeriodIndex, setStartDateRedux, setEndtDateRedux } =
  periodSlice.actions;
export default periodSlice.reducer;
