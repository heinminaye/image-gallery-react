import { toast } from 'react-hot-toast';

export const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  toast.error(message);
  console.error(error);
};