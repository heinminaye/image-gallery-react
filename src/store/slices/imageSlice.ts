import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchImages, uploadImage } from '../../api/imageApi';
import type { RootState, ImagesState, Image } from '../../models/images';;

interface FetchImagesParams {
    cursor?: string | null;
    limit?: number;
    search?: string | null;
    initialLoad?: boolean;
}

export const fetchImagesThunk = createAsyncThunk(
  'images/fetch',
  async ({ cursor = null, limit = 12, search = null, initialLoad = false }: FetchImagesParams, { getState }) => {
    const response = await fetchImages(cursor, limit, search);
    return {
      images: response.data.images,
      nextCursor: response.data.pagination.next_cursor,
      hasMore: response.data.pagination.has_more,
      search,
      initialLoad
    };
  }
);

export const uploadImageThunk = createAsyncThunk(
  'images/upload',
  async (payload: { file: File; title: string; description: string; width?: number; height?: number }) => {
    const { file, title, description, width, height } = payload;
    return await uploadImage(file, title, description, width, height);
  }
);

const initialState = {
  images: [] as Image[],
  loading: false,
  error: null as string | null,
  hasMore: true,
  nextCursor: null as string | null,
  searchQuery: null as string | null,
};


const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearImages: (state) => {
      state.images = [];
      state.nextCursor = null;
      state.hasMore = true;
    },
    setSearchQuery: (state, action: PayloadAction<string | null>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
       .addCase(fetchImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.initialLoad
          ? action.payload.images
          : [...state.images, ...action.payload.images];
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.searchQuery = action.payload.search;
      })
      .addCase(fetchImagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch images';
      })
      .addCase(uploadImageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [action.payload, ...state.images];
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload image';
      });
  },
});

export const { clearImages, setSearchQuery } = imageSlice.actions;
export default imageSlice.reducer;