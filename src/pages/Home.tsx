import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import SearchBar from '../components/SearchBar';
import UploadModal from '../components/UploadModal';
import { motion } from 'framer-motion';
import { FiImage, FiUpload } from 'react-icons/fi';
import Loader from '../components/Loader';
import type { Image } from '../models/images';

const Home = () => {
  const { images, loading, error } = useAppSelector((state) => state.images);
  const { loadMoreRef } = useInfiniteScroll();
  const [ selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-3 pb-2 sticky top-0 z-50">
        <header className="rounded-xl bg-white/90 backdrop-blur-md py-3 px-4 border border-white/20 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-600">
              <FiImage size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Pixel Gallery
            </h1>
          </motion.div>

          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            <SearchBar />
            <motion.button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm font-medium"
            >
              <FiUpload size={16} />
              <span>Upload</span>
            </motion.button>
          </div>
        </div>
      </header>
     </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {error && (
            <div className="my-6 mx-4 p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && images.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center bg-blue-50 p-5 rounded-full mb-4">
                <FiImage className="text-blue-500" size={28} />
              </div>
              <p className="text-gray-500 text-sm font-medium">No images found</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5"
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center my-12">
              <Loader />
            </div>
          )}

          <div ref={loadMoreRef} className="h-1" />
        </div>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
};

export default Home;