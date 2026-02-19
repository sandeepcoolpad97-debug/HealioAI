import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchSupportTickets = createAsyncThunk(
    'supportTickets/fetchSupportTickets',
    async ({ page = 1, limit = 10, filters = {} } = {}, { rejectWithValue }) => {
        try {
            let url = `/support-tickets?page=${page}&limit=${limit}`;
            if (filters.raisedById) url += `&raisedById=${filters.raisedById}`;
            if (filters.raisedByRole) url += `&raisedByRole=${filters.raisedByRole}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.priority) url += `&priority=${filters.priority}`;
            if (filters.assignedToId) url += `&assignedToId=${filters.assignedToId}`;
            if (filters.category) url += `&category=${filters.category}`;
            if (filters.search) url += `&search=${filters.search}`;
            const data = await api.get(url);
            return { data: data.data || [], meta: data.meta || {} };
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch support tickets');
        }
    }
);

export const fetchSupportTicketById = createAsyncThunk(
    'supportTickets/fetchSupportTicketById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/support-tickets/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch support ticket');
        }
    }
);

export const createSupportTicket = createAsyncThunk(
    'supportTickets/createSupportTicket',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/support-tickets', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to create support ticket');
        }
    }
);

export const updateSupportTicket = createAsyncThunk(
    'supportTickets/updateSupportTicket',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/support-tickets/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update support ticket');
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'supportTickets/updateTicketStatus',
    async ({ id, status, performedByRole, performedById }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/support-tickets/${id}/status`, {
                status,
                performedByRole,
                performedById,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update ticket status');
        }
    }
);

export const assignTicket = createAsyncThunk(
    'supportTickets/assignTicket',
    async ({ id, assignedToRole, assignedToId, performedByRole, performedById }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/support-tickets/${id}/assign`, {
                assignedToRole,
                assignedToId,
                performedByRole,
                performedById,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to assign ticket');
        }
    }
);

export const updateTicketPriority = createAsyncThunk(
    'supportTickets/updateTicketPriority',
    async ({ id, priority, performedByRole, performedById }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/support-tickets/${id}/priority`, {
                priority,
                performedByRole,
                performedById,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update ticket priority');
        }
    }
);

export const addTicketReply = createAsyncThunk(
    'supportTickets/addTicketReply',
    async ({ id, message, performedByRole, performedById, attachments }, { rejectWithValue }) => {
        try {
            await api.post(`/support-tickets/${id}/reply`, {
                message,
                performedByRole,
                performedById,
                attachments,
            });
            return id;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to add reply');
        }
    }
);

export const deleteSupportTicket = createAsyncThunk(
    'supportTickets/deleteSupportTicket',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/support-tickets/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to delete support ticket');
        }
    }
);

const initialState = {
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedTicket: null,
    loading: false,
    listLoading: false,
    error: null,
};

const supportTicketsSlice = createSlice({
    name: 'supportTickets',
    initialState,
    reducers: {
        clearSelectedTicket: (state) => {
            state.selectedTicket = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // list
            .addCase(fetchSupportTickets.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchSupportTickets.fulfilled, (state, { payload }) => {
                state.listLoading = false;
                state.list = payload.data;
                state.meta = payload.meta;
            })
            .addCase(fetchSupportTickets.rejected, (state, { payload }) => {
                state.listLoading = false;
                state.error = payload;
            })
            // get by id
            .addCase(fetchSupportTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTicketById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedTicket = payload;
            })
            .addCase(fetchSupportTicketById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // create
            .addCase(createSupportTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSupportTicket.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createSupportTicket.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // update
            .addCase(updateSupportTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSupportTicket.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedTicket = payload;
                const i = state.list.findIndex((t) => t._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateSupportTicket.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // update status
            .addCase(updateTicketStatus.fulfilled, (state, { payload }) => {
                state.selectedTicket = payload;
                const i = state.list.findIndex((t) => t._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateTicketStatus.rejected, (state, { payload }) => {
                state.error = payload;
            })
            // assign
            .addCase(assignTicket.fulfilled, (state, { payload }) => {
                state.selectedTicket = payload;
                const i = state.list.findIndex((t) => t._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(assignTicket.rejected, (state, { payload }) => {
                state.error = payload;
            })
            // update priority
            .addCase(updateTicketPriority.fulfilled, (state, { payload }) => {
                state.selectedTicket = payload;
                const i = state.list.findIndex((t) => t._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateTicketPriority.rejected, (state, { payload }) => {
                state.error = payload;
            })
            // add reply
            .addCase(addTicketReply.rejected, (state, { payload }) => {
                state.error = payload;
            })
            // delete
            .addCase(deleteSupportTicket.fulfilled, (state, { payload }) => {
                state.list = state.list.filter((t) => t._id !== payload);
                state.selectedTicket = null;
            })
            .addCase(deleteSupportTicket.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { clearSelectedTicket, clearError } = supportTicketsSlice.actions;
export default supportTicketsSlice.reducer;
