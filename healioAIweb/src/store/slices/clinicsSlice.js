import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchClinics = createAsyncThunk(
  'clinics/fetchClinics',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/clinics?page=${page}&limit=${limit}`);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch clinics');
    }
  }
);

export const fetchClinicById = createAsyncThunk(
  'clinics/fetchClinicById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/clinics/${id}`);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch clinic');
    }
  }
);

export const createClinic = createAsyncThunk(
  'clinics/createClinic',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/clinics', payload);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create clinic');
    }
  }
);

export const updateClinic = createAsyncThunk(
  'clinics/updateClinic',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/clinics/${id}`, payload);
      return res.data ?? res;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update clinic');
    }
  }
);

export const deleteClinic = createAsyncThunk(
  'clinics/deleteClinic',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/clinics/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete clinic');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedClinic: null,
  loading: false,
  listLoading: false,
  error: null,
};

const clinicsSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    clearSelectedClinic: (state) => {
      state.selectedClinic = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchClinics.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      .addCase(fetchClinicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedClinic = payload;
      })
      .addCase(fetchClinicById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClinic.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createClinic.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClinic.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedClinic = payload;
        const i = state.list.findIndex((c) => c._id === payload._id);
        if (i >= 0) state.list[i] = payload;
      })
      .addCase(updateClinic.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteClinic.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((c) => c._id !== payload);
        state.selectedClinic = null;
      })
      .addCase(deleteClinic.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearSelectedClinic, clearError } = clinicsSlice.actions;
export default clinicsSlice.reducer;
