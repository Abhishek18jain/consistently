import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  riskStatus: null,
  lastResponse: null,
  loading: false,
  error: null
};

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {}
});

export default coachSlice.reducer;
