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
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        <header className="sticky top-0 z-50 bg-white shadow-md py-4 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl flex justify-between items-center h-full gap-4 flex-wrap">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-semibold text-gray-900 flex-shrink-0"
    >
      Image Gallery
    </motion.h1>

    {/* Search bar and Add button container */}
    <div className="flex items-center gap-3 flex-grow min-w-[250px] max-w-lg">
      <SearchBar />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsUploadModalOpen(true)}
        aria-label="Add new image"
        className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition-colors flex-shrink-0"
      >
        Add Image
      </motion.button>
    </div>
  </div>
</header>

        {error && (
          <div className="my-6 p-4 bg-red-100 text-red-700 rounded-lg text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {!loading && images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No images found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 py-0 px-4 sm:px-6 lg:px-8"
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
          <div className="flex justify-center my-12">
            <Loader />
          </div>
        )}

        <div ref={loadMoreRef} className="h-1" />
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
