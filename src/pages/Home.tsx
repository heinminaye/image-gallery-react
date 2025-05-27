import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import SearchBar from '../components/SearchBar';
import UploadModal from '../components/UploadModal';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Loader from '../components/Loader';
import type { Image } from '../models/images';

const Home = () => {
  const { images, loading, error } = useAppSelector((state) => state.images);
  const { loadMoreRef } = useInfiniteScroll();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Image Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600"
          >
            Browse and upload your favorite images
          </motion.p>
        </div>

        <SearchBar />

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {images.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {images.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        )}

        <div ref={loadMoreRef} className="h-1" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <FiPlus size={24} />
        </motion.button>

        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Home;