import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async ({ page = 1, limit = 10, reviewFor, reviewForId, userId } = {}, { rejectWithValue }) => {
        try {
            let url = `/reviews?page=${page}&limit=${limit}`;
            if (reviewFor) url += `&reviewFor=${reviewFor}`;
            if (reviewForId) url += `&reviewForId=${reviewForId}`;
            if (userId) url += `&userId=${userId}`;
            const data = await api.get(url);
            return { data: data.data || [], meta: data.meta || {} };
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch reviews');
        }
    }
);

export const fetchReviewById = createAsyncThunk(
    'reviews/fetchReviewById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/reviews/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch review');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/reviews', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to create review');
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/reviews/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to update review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to delete review');
        }
    }
);

const initialState = {
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedReview: null,
    loading: false,
    listLoading: false,
    error: null,
};

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearSelectedReview: (state) => {
            state.selectedReview = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // list
            .addCase(fetchReviews.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, { payload }) => {
                state.listLoading = false;
                state.list = payload.data;
                state.meta = payload.meta;
            })
            .addCase(fetchReviews.rejected, (state, { payload }) => {
                state.listLoading = false;
                state.error = payload;
            })
            // get by id
            .addCase(fetchReviewById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedReview = payload;
            })
            .addCase(fetchReviewById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // create
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReview.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // update
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedReview = payload;
                const i = state.list.findIndex((r) => r._id === payload._id);
                if (i >= 0) state.list[i] = payload;
            })
            .addCase(updateReview.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // delete
            .addCase(deleteReview.fulfilled, (state, { payload }) => {
                state.list = state.list.filter((r) => r._id !== payload);
                state.selectedReview = null;
            })
            .addCase(deleteReview.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { clearSelectedReview, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
