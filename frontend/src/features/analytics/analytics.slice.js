import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardAnalyticsAPI } from "./analyticsApi";

/* ---------------- Async Thunk ---------------- */

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDashboardAnalyticsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

/* ---------------- Initial State ---------------- */

const initialState = {
  streak: null,
  heatmap: [],
  averageCompletion: 0,
  loading: false,
  error: null
};

/* ---------------- Slice ---------------- */

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.streak = action.payload.streak;
        state.heatmap = action.payload.heatmap;
        state.averageCompletion = action.payload.averageCompletion;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default analyticsSlice.reducer;
