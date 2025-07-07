import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deleteImage, fetchImages, updateImageMetadata, uploadImage } from '../../api/imageApi';
import type { ImagesState } from '../../models/images';

interface FetchImagesParams {
  cursor?: string | null;
  limit?: number;
  search?: string | null;
  initialLoad?: boolean;
}

export const fetchImagesThunk = createAsyncThunk(
  'images/fetch',
  async ({ cursor = null, limit = 12, search = null, initialLoad = false }: FetchImagesParams) => {
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

export const updateImageMetadataThunk = createAsyncThunk(
  'images/updateMetadata',
  async (payload: {
    fileId: string;
    title: string;
    description: string;
    width?: number;
    height?: number
  }) => {
    const { fileId, title, description, width, height } = payload;
    return await updateImageMetadata(fileId, title, description, width, height);
  }
);

export const deleteImageThunk = createAsyncThunk(
  'images/delete',
  async (fileId: string) => {
    await deleteImage(fileId);
    return fileId;
  }
);

const initialState: ImagesState = {
  images: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: null,
  searchQuery: null,
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
      })
      .addCase(updateImageMetadataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImageMetadataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.map(image =>
          image.fileId === action.payload.fileId ? action.payload : image
        );
      })
      .addCase(updateImageMetadataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update image';
      })
      .addCase(deleteImageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(image => image.fileId !== action.payload);
      })
      .addCase(deleteImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete image';
      });


  },
});

export const { clearImages, setSearchQuery } = imageSlice.actions;
export default imageSlice.reducer;