import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../Config/ApiConfig";
import { signup, signin, fetchProfile  } from "../Utility/Auth";

// Async Thunks for API Calls
export const signupUser = createAsyncThunk(`${API_BASE_URL}auth/signup`, async (userData, { rejectWithValue }) => {
  try {
    const response = await signup(userData);
    localStorage.setItem("token", response.jwt);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const signinUser = createAsyncThunk(`${API_BASE_URL}auth/signin`, async (loginData, { rejectWithValue }) => {
  try {
    const response = await signin(loginData);
    localStorage.setItem("token", response.jwt);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const fetchUserProfile = createAsyncThunk(`${API_BASE_URL}/api/profile`, async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token || localStorage.getItem("token");
    if (!token) throw new Error("No token available");
    const response = await fetchProfile(token);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => { state.loading = true; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.jwt;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signinUser.pending, (state) => { state.loading = true; })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.jwt;
        state.user = action.payload.user;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
