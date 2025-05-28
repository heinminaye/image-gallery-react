import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import SearchBar from "../components/SearchBar";
import UploadModal from "../components/UploadModal";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiUpload, FiCameraOff, FiX } from "react-icons/fi";
import Loader from "../components/Loader";
import type { Image } from "../models/images";

const Home = () => {
  const { images, loading, error, hasMore } = useAppSelector(
    (state) => state.images
  );
  const { loadMoreRef } = useInfiniteScroll();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const loadingSkeletons = Array(6).fill(null);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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
              <SearchBar disabled={loading} />
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm font-medium disabled:opacity-50"
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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-6 mx-4 p-4 bg-red-50 text-red-600 rounded-lg text-center text-sm font-medium border border-red-100 flex items-center justify-center gap-2"
            >
              <FiX className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && images.length === 0 && !hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[calc(100vh-180px)] p-6 text-center"
            >
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <FiCameraOff className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No Images Found
              </h3>
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm font-medium"
              >
                <FiUpload size={16} />
                <span>Upload Image</span>
              </motion.button>
            </motion.div>
          )}

          {/* Image Grid */}
          <AnimatePresence>
            {(images.length > 0 || loading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5"
              >
                {/* Actual Images */}
                {images.map((image) => (
                  <ImageCard
                    key={image._id}
                    image={image}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}

                {/* Loading Skeletons */}
                {loading &&
                  loadingSkeletons.map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                    >
                      <div className="animate-pulse">
                        <div className="bg-gray-200 aspect-[6/3] w-full" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-full" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Infinite scroll loader */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              <Loader />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default Home;
