import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async ({ page = 1, limit = 10, search, isActive } = {}, { rejectWithValue }) => {
    try {
      let query = `/services?page=${page}&limit=${limit}`;
      if (search) query += `&search=${search}`;
      if (isActive !== undefined) query += `&isActive=${isActive}`;
      const data = await api.get(query);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/services/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch service');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/services', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/services/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/services/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete service');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedService: null,
  loading: false,
  listLoading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchServices.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchServices.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      // get by id
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedService = payload;
      })
      .addCase(fetchServiceById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // create
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(createService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // update
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.selectedService && state.selectedService._id === payload._id) {
          state.selectedService = payload;
        }
      })
      .addCase(updateService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // delete
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== payload);
        if (state.selectedService && state.selectedService._id === payload) {
          state.selectedService = null;
        }
      })
      .addCase(deleteService.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSelectedService, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
