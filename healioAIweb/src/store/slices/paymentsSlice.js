import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

// Async Thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async ({ page = 1, limit = 10, userId, status, provider, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      let query = `/payments?page=${page}&limit=${limit}`;
      if (userId) query += `&userId=${userId}`;
      if (status) query += `&status=${status}`;
      if (provider) query += `&provider=${provider}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      
      const response = await api.get(query);
      return { data: response.data || [], meta: response.meta || {} };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch payment details');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create payment');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updatePaymentStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/payments/${id}/status`, statusData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update payment status');
    }
  }
);

export const initiateRefund = createAsyncThunk(
  'payments/initiateRefund',
  async ({ id, refundData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payments/${id}/refund`, refundData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to initiate refund');
    }
  }
);

const initialState = {
  payments: [],
  selectedPayment: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Payments
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Payment By ID
    builder
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Payment
    builder
      .addCase(createPayment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.payments.unshift(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // Update Payment Status
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.selectedPayment?._id === action.payload._id) {
          state.selectedPayment = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // Initiate Refund
    builder
      .addCase(initiateRefund.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(initiateRefund.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.selectedPayment?._id === action.payload._id) {
          state.selectedPayment = action.payload;
        }
      })
      .addCase(initiateRefund.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearSelectedPayment, clearErrors } = paymentsSlice.actions;
export default paymentsSlice.reducer;
