import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI, verifyEmailAPI, loginAPI } from "./authApi";

/* =========================
   ASYNC THUNKS
   ========================= */

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerAPI(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAPI(data);
      return res.data; // { message, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyEmailAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed"
      );
    }
  }
);

/* =========================
   SLICE
   ========================= */

const authSlice = createSlice({
  name: "auth",

  initialState: {
    loading: false,
    error: null,
    authChecked: false,

    registerSuccess: false,

    loginLoading: false,
    loginError: null,
    token: null,
    isAuthenticated: false,

    verifyLoading: false,
    verifyError: null,
    verified: false,
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },

    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },

    /* 🔥 Restore token on app start */
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    /* 🔥 Logout */
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;

      // remove persisted token
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= REGISTER ================= */

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= VERIFY EMAIL ================= */

      .addCase(verifyEmail.pending, (state) => {
        state.verifyLoading = true;
      })

      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyLoading = false;
        state.verified = true;

        const token = action.payload.token;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          localStorage.setItem("token", token);
        }
      })

      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload;
      })

      /* ================= LOGIN ================= */

      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;

        const token = action.payload.token;

        state.token = token;
        state.isAuthenticated = true;

        /* 🔥 Persist token */
        localStorage.setItem("token", token);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });
  },
});

export const {
  clearAuthError,
  clearRegisterSuccess,
  setToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;