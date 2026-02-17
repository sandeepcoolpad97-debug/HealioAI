import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchTicketHistory = createAsyncThunk(
    'supportTicketHistory/fetchTicketHistory',
    async (ticketId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/support-ticket-history/ticket/${ticketId}`);
            return res.data || [];
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch ticket history');
        }
    }
);

export const fetchHistoryList = createAsyncThunk(
    'supportTicketHistory/fetchHistoryList',
    async ({ page = 1, limit = 10, filters = {} } = {}, { rejectWithValue }) => {
        try {
            let url = `/support-ticket-history?page=${page}&limit=${limit}`;
            if (filters.ticketId) url += `&ticketId=${filters.ticketId}`;
            if (filters.action) url += `&action=${filters.action}`;
            if (filters.performedByRole) url += `&performedByRole=${filters.performedByRole}`;
            const data = await api.get(url);
            return { data: data.data || [], meta: data.meta || {} };
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch history list');
        }
    }
);

const initialState = {
    history: [],
    historyList: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    historyLoading: false,
    error: null,
};

const supportTicketHistorySlice = createSlice({
    name: 'supportTicketHistory',
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.history = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch ticket history
            .addCase(fetchTicketHistory.pending, (state) => {
                state.historyLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketHistory.fulfilled, (state, { payload }) => {
                state.historyLoading = false;
                state.history = payload;
            })
            .addCase(fetchTicketHistory.rejected, (state, { payload }) => {
                state.historyLoading = false;
                state.error = payload;
            })
            // fetch history list
            .addCase(fetchHistoryList.pending, (state) => {
                state.historyLoading = true;
                state.error = null;
            })
            .addCase(fetchHistoryList.fulfilled, (state, { payload }) => {
                state.historyLoading = false;
                state.historyList = payload.data;
                state.meta = payload.meta;
            })
            .addCase(fetchHistoryList.rejected, (state, { payload }) => {
                state.historyLoading = false;
                state.error = payload;
            });
    },
});

export const { clearHistory, clearError } = supportTicketHistorySlice.actions;
export default supportTicketHistorySlice.reducer;
