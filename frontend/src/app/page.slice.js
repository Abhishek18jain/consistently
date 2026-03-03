import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: null,
  saving: false,
  error: null
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {}
});

export default pageSlice.reducer;
