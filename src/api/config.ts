const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

if (!API_BASE_URL || !IMAGE_BASE_URL) {
  throw new Error('Missing environment variables for API configuration');
}

export const config = {
  apiBaseUrl: API_BASE_URL,
  imageBaseUrl: IMAGE_BASE_URL,
  endpoints: {
    images: '/images',
    upload: '/images/upload',
  },
};

export default config;