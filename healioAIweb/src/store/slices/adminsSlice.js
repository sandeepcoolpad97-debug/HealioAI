import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchAdmins = createAsyncThunk(
    'admins/fetchAdmins',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const data = await api.get(`/admins?page=${page}&limit=${limit}`);
            return { data: data.data || [], meta: data.meta || {} };
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch admins');
        }
    }
);

export const fetchAdminById = createAsyncThunk(
    'admins/fetchAdminById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admins/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch admin');
        }
    }
);

export const createAdmin = createAsyncThunk(
    'admins/createAdmin',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/admins', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to create admin');
        }
    }
);

export const updateAdmin = createAsyncThunk(
    'admins/updateAdmin',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/admins/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update admin');
        }
    }
);

export const deleteAdmin = createAsyncThunk(
    'admins/deleteAdmin',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admins/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to delete admin');
        }
    }
);

const initialState = {
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedAdmin: null,
    loading: false,
    listLoading: false,
    error: null,
};

const adminsSlice = createSlice({
    name: 'admins',
    initialState,
    reducers: {
        clearSelectedAdmin: (state) => {
            state.selectedAdmin = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // list
            .addCase(fetchAdmins.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchAdmins.fulfilled, (state, { payload }) => {
                state.listLoading = false;
                state.list = payload.data;
                state.meta = payload.meta;
            })
            .addCase(fetchAdmins.rejected, (state, { payload }) => {
                state.listLoading = false;
                state.error = payload;
            })
            // get by id
            .addCase(fetchAdminById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedAdmin = payload;
            })
            .addCase(fetchAdminById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // create
            .addCase(createAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAdmin.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createAdmin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // update
            .addCase(updateAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdmin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedAdmin = payload;
                const i = state.list.findIndex((a) => a._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateAdmin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // delete
            .addCase(deleteAdmin.fulfilled, (state, { payload }) => {
                state.list = state.list.filter((a) => a._id !== payload);
                state.selectedAdmin = null;
            })
            .addCase(deleteAdmin.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { clearSelectedAdmin, clearError } = adminsSlice.actions;
export default adminsSlice.reducer;
