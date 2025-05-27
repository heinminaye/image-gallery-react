import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../api/imageApi';
import { IoClose } from 'react-icons/io5';
import type { Image } from '../models/images';

interface ImageModalProps {
  image: Image | null;
  onClose: () => void;
}

const ImageModal = ({ image, onClose }: ImageModalProps) => {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
              onClick={onClose}
            >
              <IoClose size={24} />
            </button>
            <div className="h-full flex flex-col md:flex-row">
              <div className="md:w-2/3 h-64 md:h-auto bg-gray-100">
                <img
                  src={getImageUrl(image.fileId)}
                  alt={image.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="md:w-1/3 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-2">{image.title}</h2>
                <p className="text-gray-700 mb-4">{image.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</p>
                  <p>Size: {(image.size / 1024).toFixed(2)} KB</p>
                  {image.width && image.height && (
                    <p>
                      Dimensions: {image.width} × {image.height} px
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;