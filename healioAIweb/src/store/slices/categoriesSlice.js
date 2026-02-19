import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ page = 1, limit = 10, search, isActive } = {}, { rejectWithValue }) => {
    try {
      let query = `/categories?page=${page}&limit=${limit}`;
      if (search) query += `&search=${search}`;
      if (isActive !== undefined) query += `&isActive=${isActive}`;
      const data = await api.get(query);
      return { data: data.data || [], meta: data.meta || {} };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/categories/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch category');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/categories', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/categories/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.details?.message || err.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  selectedCategory: null,
  loading: false,
  listLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchCategories.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.list = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.listLoading = false;
        state.error = payload;
      })
      // get by id
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedCategory = payload;
      })
      .addCase(fetchCategoryById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // create
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Optionally refresh list or add to list if client-side update preferred
      })
      .addCase(createCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.selectedCategory && state.selectedCategory._id === payload._id) {
          state.selectedCategory = payload;
        }
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== payload);
        if (state.selectedCategory && state.selectedCategory._id === payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSelectedCategory, clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
