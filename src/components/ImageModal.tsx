import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../api/imageApi';
import {
  IoClose,
  IoDownloadOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoImageOutline,
} from 'react-icons/io5';
import type { Image } from '../models/images';
import { downloadFile, formatFileSize } from '../utils/helpers';
import { useEffect } from 'react';

interface ImageModalProps {
  image: Image | null;
  onClose: () => void;
}

const ImageModal = ({ image, onClose }: ImageModalProps) => {
  useEffect(() => {
    if (image) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [image]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-lg border border-gray-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">
                {image.title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <IoClose size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Content area - now flex-col for mobile */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* Image container - full width on mobile */}
              <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 h-[250px] md:h-auto min-h-[250px]">
                <motion.img
                  src={getImageUrl(image.fileId)}
                  alt={image.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Info section - improved spacing */}
              <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto bg-white border-t md:border-t-0 md:border-l border-gray-200">
                <div className="space-y-4">

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <IoCalendarOutline 
                        size={20} 
                        className="flex-shrink-0 text-gray-400 mt-0.5" 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Upload Date</p>
                        <p className="text-gray-900 text-sm">
                          {new Date(image.uploadDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <IoImageOutline 
                        size={20} 
                        className="flex-shrink-0 text-gray-400 mt-0.5" 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">File Information</p>
                        <p className="text-gray-900 text-sm">{formatFileSize(image.size)}</p>
                        {image.width && image.height && (
                          <p className="text-gray-900 text-sm">
                            {image.width} × {image.height} px
                          </p>
                        )}
                      </div>
                    </div>

                    {image.description && (
                    <div className="flex gap-3">
                      <IoInformationCircleOutline 
                        size={20} 
                        className="flex-shrink-0 text-gray-400 mt-0.5" 
                      />
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {image.description}
                      </p>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer */}
           <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(getImageUrl(image?.fileId), image.fileId, image.title);
                }}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                <IoDownloadOutline size={18} />
                <span>Download</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;