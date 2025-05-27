export interface Image {
  _id: string;
  title: string;
  description: string;
  filename: string;
  size: number;
  contentType: string;
  fileId: string;
  width?: number;
  height?: number;
  uploadDate: string;
}

export interface ImagesState {
  images: Image[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor: string | null;
  searchQuery: string | null;
}


export interface ImageResponse {
  returncode: string;
  message: string;
  data: {
    images: Image[];
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
    };
  };
}

export interface RootState {
  images: ImagesState;
}