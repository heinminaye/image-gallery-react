import axios from 'axios';
import config from './config';
import type { Image, ImageResponse } from '../models/images';

export const fetchImages = async (
  cursor: string | null = null,
  limit: number = 10,
  search: string | null = null
): Promise<ImageResponse> => {
  try {
     
    const response = await axios.get<ImageResponse>(config.endpoints.images, {
      params: { cursor, limit, search },
      baseURL: config.apiBaseUrl,
    });
    if (response.data.returncode !== "200") {
      throw new Error(response.data.message)
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); 
    }
    throw new Error('Failed to fetch images');
  }
};

export const uploadImage = async (
  file: File,
  title: string,
  description: string,
  width?: number,
  height?: number
): Promise<Image> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    if (width) formData.append('width', width.toString());
    if (height) formData.append('height', height.toString());

    const response = await axios.post(config.endpoints.upload, formData, {
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.returncode !== "200") {
      throw new Error(response.data.message)
    }
    return response.data.image;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); 
    }
    throw new Error('Failed to upload image');
  }
};

export const getImageUrl = (fileId: string): string => {
  return `${config.imageBaseUrl}/${fileId}`;
};

export const updateImageMetadata = async (
  fileId: string,
  title: string,
  description: string,
  width?: number,
  height?: number
): Promise<Image> => {
  try {
    const response = await axios.put(`${config.endpoints.images}/${fileId}`, {
      title,
      description,
      width,
      height
    }, {
      baseURL: config.apiBaseUrl,
    });
    if (response.data.returncode !== "200") {
      throw new Error(response.data.message)
    }
    return response.data.image;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); 
    }
    throw new Error('Failed to update image');
  }
};

export const deleteImage = async (fileId: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${config.endpoints.images}/${fileId}`, {
      baseURL: config.apiBaseUrl,
    });
    if (response.data.returncode !== "200") {
      throw new Error(response.data.message)
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); 
    }
    throw new Error('Failed to delete image');
  }
};