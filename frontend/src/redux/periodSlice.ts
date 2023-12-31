import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type periodState = {
  periodIndex: number | undefined;
  startDate: Date;
  endDate: Date;
};

const initialState: periodState = {
  periodIndex: 0,
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
};

const periodSlice = createSlice({
  name: "periods",
  initialState,
  reducers: {
    setActiveChip: (state, action: PayloadAction<any>) => {
      state.periodIndex = action.payload;
    },
    setStartDate: (state, action: PayloadAction<any>) => {
      state.startDate = action.payload;
    },
    setEndtDate: (state, action: PayloadAction<any>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setActiveChip, setStartDate, setEndtDate } = periodSlice.actions;
export default periodSlice.reducer;
