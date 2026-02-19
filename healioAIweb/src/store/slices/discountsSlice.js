import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const data = await api.get(`/discounts?page=${page}&limit=${limit}`);
            return { data: data.data || [], meta: data.meta || {} };
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch discounts');
        }
    }
);

export const fetchDiscountById = createAsyncThunk(
    'discounts/fetchDiscountById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/discounts/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch discount');
        }
    }
);

export const createDiscount = createAsyncThunk(
    'discounts/createDiscount',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/discounts', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to create discount');
        }
    }
);

export const updateDiscount = createAsyncThunk(
    'discounts/updateDiscount',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/discounts/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update discount');
        }
    }
);

export const deleteDiscount = createAsyncThunk(
    'discounts/deleteDiscount',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/discounts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to delete discount');
        }
    }
);

const initialState = {
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedDiscount: null,
    loading: false,
    listLoading: false,
    error: null,
};

const discountsSlice = createSlice({
    name: 'discounts',
    initialState,
    reducers: {
        clearSelectedDiscount: (state) => {
            state.selectedDiscount = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // list
            .addCase(fetchDiscounts.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, { payload }) => {
                state.listLoading = false;
                state.list = payload.data;
                state.meta = payload.meta;
            })
            .addCase(fetchDiscounts.rejected, (state, { payload }) => {
                state.listLoading = false;
                state.error = payload;
            })
            // get by id
            .addCase(fetchDiscountById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscountById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedDiscount = payload;
            })
            .addCase(fetchDiscountById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // create
            .addCase(createDiscount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDiscount.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createDiscount.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // update
            .addCase(updateDiscount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDiscount.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedDiscount = payload;
                const i = state.list.findIndex((d) => d._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateDiscount.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // delete
            .addCase(deleteDiscount.fulfilled, (state, { payload }) => {
                state.list = state.list.filter((d) => d._id !== payload);
                state.selectedDiscount = null;
            })
            .addCase(deleteDiscount.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { clearSelectedDiscount, clearError } = discountsSlice.actions;
export default discountsSlice.reducer;
