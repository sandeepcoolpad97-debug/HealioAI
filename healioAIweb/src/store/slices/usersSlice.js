import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/users?page=${page}&limit=${limit}`);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/users', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete user');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedUser: null,
  loading: false,
  listLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchUsers.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      // get by id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedUser = payload;
      })
      .addCase(fetchUserById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // create
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedUser = payload;
        const i = state.list.findIndex((u) => u._id === payload._id);
        if (i >= 0) state.list[i] = payload;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // delete
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((u) => u._id !== payload);
        state.selectedUser = null;
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
