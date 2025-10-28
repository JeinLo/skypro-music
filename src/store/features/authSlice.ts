import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  access: string | null;
  refresh: string | null;
  userId: number | null;
  username: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  access: null,
  refresh: null,
  userId: null,
  username: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        access: string;
        refresh: string;
        userId: number;
        username: string;
      }>
    ) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.access = null;
      state.refresh = null;
      state.userId = null;
      state.username = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;