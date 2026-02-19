import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

// Upload media to Cloudinary
export const uploadMedia = createAsyncThunk(
    'media/uploadMedia',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.details?.message || err.message || 'Failed to upload media');
        }
    }
);

// Fetch media by ID
export const fetchMediaById = createAsyncThunk(
    'media/fetchMediaById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/media/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch media');
        }
    }
);

// Delete media
export const deleteMedia = createAsyncThunk(
    'media/deleteMedia',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/media/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to delete media');
        }
    }
);

const initialState = {
    list: [],
    selectedMedia: null,
    loading: false,
    uploadProgress: 0,
    error: null,
};

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        clearSelectedMedia: (state) => {
            state.selectedMedia = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload media
            .addCase(uploadMedia.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadMedia.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.uploadProgress = 100;
                state.list.push(payload);
            })
            .addCase(uploadMedia.rejected, (state, { payload }) => {
                state.loading = false;
                state.uploadProgress = 0;
                state.error = payload;
            })
            // Fetch media by ID
            .addCase(fetchMediaById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMediaById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedMedia = payload;
                // Add to list if not already present
                const exists = state.list.find(m => m._id === payload._id);
                if (!exists) {
                    state.list.push(payload);
                }
            })
            .addCase(fetchMediaById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Delete media
            .addCase(deleteMedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMedia.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.list = state.list.filter(m => m._id !== payload);
                if (state.selectedMedia?._id === payload) {
                    state.selectedMedia = null;
                }
            })
            .addCase(deleteMedia.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { clearSelectedMedia, clearError, setUploadProgress } = mediaSlice.actions;
export default mediaSlice.reducer;
