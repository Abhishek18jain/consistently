import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  verifyTokenAPI,
  forgetpasswordAPI,
  resetPasswordAPI
} from "./authApi";

/* ------------------ Async Thunks ------------------ */

/* REGISTER */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

/* LOGIN */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* VERIFY SESSION */
export const verifySession = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const res = await verifyTokenAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

/* 🔹 FORGOT PASSWORD — SEND OTP */
export const forgotPassword = createAsyncThunk(
  "/auth/forget-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await forgetpasswordAPI({ email });
      return { email, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

/* 🔹 RESET PASSWORD — OTP + NEW PASSWORD */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ otp, newPassword }, { getState, rejectWithValue }) => {
    try {
      const email = getState().auth.resetEmail;

      const res = await resetPasswordAPI({
        email,
        otp,
        newPassword
      });

      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

/* ------------------ Initial State ------------------ */

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  loading: false,
  error: null,

  /* Reset Password Flow */
  resetEmail: null,
  resetLoading: false,
  resetError: null,
  passwordResetSuccess: false
};

/* ------------------ Slice ------------------ */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },

    clearResetState(state) {
      state.resetEmail = null;
      state.resetError = null;
      state.passwordResetSuccess = false;
    }
  },

  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VERIFY SESSION */
      .addCase(verifySession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifySession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })

      /* 🔹 FORGOT PASSWORD */
      .addCase(forgotPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.resetLoading = false;
        state.resetEmail = action.payload.email; // store email
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      })

      /* 🔹 RESET PASSWORD */
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetLoading = false;
        state.passwordResetSuccess = true;
        state.resetEmail = null; // clear after success
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      });
  }
});

export const { logout, clearResetState } = authSlice.actions;
export default authSlice.reducer;
