import { saveAs } from 'file-saver';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const downloadFile = async (url: string, fileId: string,title:string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');
    const blob = await response.blob();
    saveAs(blob, title || `image_${fileId.slice(0, 8)}`);
  } catch (error) {
    console.error('Download failed:', error);
  }
};