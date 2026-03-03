import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

/* ================= FETCH CONTEXT ================= */

export const fetchCoachContext = createAsyncThunk(
  "coach/fetchContext",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/coach/context");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

/* ================= FETCH QUESTION BY KEY ================= */

export const fetchQuestionSet = createAsyncThunk(
  "coach/fetchQuestionSet",
  async (key, thunkAPI) => {
    try {
      const res = await api.get(`/coach/${key}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

/* ================= SUBMIT STEP ================= */

export const submitStep = createAsyncThunk(
  "coach/submitStep",
  async ({ answers, currentKey }, thunkAPI) => {
    try {
      const res = await api.post("/coach/session", {
        answers,
        stepKey: currentKey
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

/* ================= SLICE ================= */

const initialState = {
  context: null,
  currentKey: "RISK_TODAY",
  questionSet: null,
  answersByKey: {},

  loadingContext: false,
  loadingQuestions: false,
  submitting: false,

  error: null,
  flowComplete: false,
  result: null
};

const coachSlice = createSlice({
  name: "coach",
  initialState,

  reducers: {
    setAnswer(state, action) {
      const { questionId, selectedOption } = action.payload;
      const key = state.currentKey;

      if (!state.answersByKey[key]) state.answersByKey[key] = [];

      const existing = state.answersByKey[key].find(
        a => a.questionId === questionId
      );

      if (existing) existing.selectedOption = selectedOption;
      else state.answersByKey[key].push({ questionId, selectedOption });
    },

    resetFlow(state) {
      return initialState; // 🔥 full reset
    }
  },

  extraReducers: builder => {
    builder

      /* ===== CONTEXT ===== */
      .addCase(fetchCoachContext.pending, s => {
        s.loadingContext = true;
        s.error = null;
      })
      .addCase(fetchCoachContext.fulfilled, (s, a) => {
        s.loadingContext = false;
        s.context = a.payload;
      })
      .addCase(fetchCoachContext.rejected, (s, a) => {
        s.loadingContext = false;
        s.error = a.payload;
      })

      /* ===== QUESTIONS ===== */
      .addCase(fetchQuestionSet.pending, s => {
        s.loadingQuestions = true;
        s.error = null;
      })
      .addCase(fetchQuestionSet.fulfilled, (s, a) => {
        s.loadingQuestions = false;

        // 🔥 Defensive: ensure shape
        if (!a.payload || !a.payload.questions) {
          s.error = "Invalid question data";
          return;
        }

        s.questionSet = a.payload;
      })
      .addCase(fetchQuestionSet.rejected, (s, a) => {
        s.loadingQuestions = false;
        s.error = a.payload;
      })

      /* ===== SUBMIT STEP ===== */
      .addCase(submitStep.pending, s => {
        s.submitting = true;
        s.error = null;
      })
      .addCase(submitStep.fulfilled, (s, a) => {
        s.submitting = false;

        const { nextKey, result } = a.payload || {};

        if (!nextKey) {
          s.error = "Invalid response from server";
          return;
        }

        if (nextKey === "SUMMARY") {
          s.flowComplete = true;
          s.result = result;
        } else {
          s.currentKey = nextKey;
        }
      })
      .addCase(submitStep.rejected, (s, a) => {
        s.submitting = false;
        s.error = a.payload;
      });
  }
});

export const { setAnswer, resetFlow } = coachSlice.actions;
export default coachSlice.reducer;
