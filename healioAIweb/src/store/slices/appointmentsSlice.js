import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ page = 1, limit = 10, status, doctorId, userId, date } = {}, { rejectWithValue }) => {
    try {
      let query = `/appointments?page=${page}&limit=${limit}`;
      if (status) query += `&status=${status}`;
      if (doctorId) query += `&doctorId=${doctorId}`;
      if (userId) query += `&userId=${userId}`;
      if (date) query += `&date=${date}`;
      const data = await api.get(query);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchAppointmentById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/appointments/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/appointments/${id}/reschedule`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to reschedule appointment');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/appointments/${id}/cancel`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to cancel appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/appointments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete appointment');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedAppointment: null,
  loading: false,
  listLoading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchAppointments.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchAppointments.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      // get by id
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedAppointment = payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // reschedule
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.selectedAppointment && state.selectedAppointment._id === payload._id) {
           state.selectedAppointment = payload;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // cancel
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;
         if (state.selectedAppointment && state.selectedAppointment._id === payload._id) {
           state.selectedAppointment = payload;
        }
      })
      .addCase(cancelAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // delete
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== payload);
        if (state.selectedAppointment && state.selectedAppointment._id === payload) {
          state.selectedAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSelectedAppointment, clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
