import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  _id: string | null;
  firebaseUid: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'user' | 'clinic' | 'lab' | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  _id: null,
  firebaseUid: null,
  name: null,
  email: null,
  phone: null,
  role: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state._id = action.payload._id || state._id;
      state.firebaseUid = action.payload.firebaseUid || state.firebaseUid;
      state.name = action.payload.name || state.name;
      state.email = action.payload.email || state.email;
      state.phone = action.payload.phone || state.phone;
      state.role = action.payload.role || state.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state._id = null;
      state.firebaseUid = null;
      state.name = null;
      state.email = null;
      state.phone = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
