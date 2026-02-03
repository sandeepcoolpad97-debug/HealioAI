import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchLabs = createAsyncThunk(
  'labs/fetchLabs',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/labs?page=${page}&limit=${limit}`);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch labs');
    }
  }
);

export const fetchLabById = createAsyncThunk(
  'labs/fetchLabById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/labs/${id}`);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch lab');
    }
  }
);

export const createLab = createAsyncThunk(
  'labs/createLab',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/labs', payload);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create lab');
    }
  }
);

export const updateLab = createAsyncThunk(
  'labs/updateLab',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/labs/${id}`, payload);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update lab');
    }
  }
);

export const deleteLab = createAsyncThunk(
  'labs/deleteLab',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/labs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete lab');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedLab: null,
  loading: false,
  listLoading: false,
  error: null,
};

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    clearSelectedLab: (state) => {
      state.selectedLab = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabs.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchLabs.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchLabs.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      .addCase(fetchLabById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedLab = payload;
      })
      .addCase(fetchLabById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLab.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createLab.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLab.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedLab = payload;
        const i = state.list.findIndex((l) => l._id === payload._id);
        if (i >= 0) state.list[i] = payload;
      })
      .addCase(updateLab.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteLab.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((l) => l._id !== payload);
        state.selectedLab = null;
      })
      .addCase(deleteLab.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearSelectedLab, clearError } = labsSlice.actions;
export default labsSlice.reducer;
