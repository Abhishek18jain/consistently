import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  activeBook: null,
  latestPage: null,
  loading: false,
  error: null
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {}
});

export default journalSlice.reducer;
