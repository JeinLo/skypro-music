// src/store/features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  access: null,
  refresh: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setTokens, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;