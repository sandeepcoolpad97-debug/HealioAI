import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/roles?page=${page}&limit=${limit}`);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch roles');
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/roles/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch role');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/roles', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/roles/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/roles/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete role');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedRole: null,
  loading: false,
  listLoading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchRoles.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedRole = payload;
      })
      .addCase(fetchRoleById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createRole.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedRole = payload;
        const i = state.list.findIndex((r) => r._id === payload._id);
        if (i >= 0) state.list[i] = payload;
      })
      .addCase(updateRole.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((r) => r._id !== payload);
        state.selectedRole = null;
      })
      .addCase(deleteRole.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearSelectedRole, clearError } = rolesSlice.actions;
export default rolesSlice.reducer;
