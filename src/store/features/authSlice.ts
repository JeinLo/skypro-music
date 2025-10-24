import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  access: string | null;
  refresh: string | null;
  userId: number | null;
  username: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  access: null,
  refresh: null,
  userId: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{
      access: string;
      refresh: string;
      userId: number;
      username: string;
    }>) => {
      state.isAuthenticated = true;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.access = null;
      state.refresh = null;
      state.userId = null;
      state.username = null;
    },
  },
});

export const { setAuth, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;