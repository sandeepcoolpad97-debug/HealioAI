import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/subscriptions?page=${page}&limit=${limit}`);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch subscriptions');
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchSubscriptionById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/subscriptions/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch subscription');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/subscriptions', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create subscription');
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/subscriptions/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update subscription');
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/deleteSubscription',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/subscriptions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete subscription');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedSubscription: null,
  loading: false,
  listLoading: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchSubscriptions.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedSubscription = payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSubscription.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedSubscription = payload;
        const i = state.list.findIndex((s) => s._id === payload._id);
        if (i >= 0) state.list[i] = payload;
      })
      .addCase(updateSubscription.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteSubscription.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((s) => s._id !== payload);
        state.selectedSubscription = null;
      })
      .addCase(deleteSubscription.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearSelectedSubscription, clearError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
