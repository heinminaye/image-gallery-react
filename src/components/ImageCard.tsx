import { motion } from 'framer-motion';
import { getImageUrl } from '../api/imageApi';
import { useState } from 'react';
import type { Image } from '../models/images';
import { FiBookmark, FiShare2, FiStar } from 'react-icons/fi';

interface ImageCardProps {
  image: Image;
  onClick: () => void;
}

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with subtle zoom effect on hover */}
      <div className="relative h-64 w-full overflow-hidden">
        <motion.img
          src={getImageUrl(image.fileId)}
          alt={image.title}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          onLoad={() => setLoaded(true)}
        />
        
        {/* Top-right actions */}
        <motion.div 
          className="absolute top-3 right-3 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle bookmark
            }}
          >
            <FiBookmark className="text-gray-700" size={16} />
          </button>
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
          >
            <FiShare2 className="text-gray-700" size={16} />
          </button>
        </motion.div>
      </div>

      {/* Content area with refined gradient */}
      <div className="relative px-5 pb-5 pt-16 -mt-12 bg-gradient-to-t from-blue-600/90 via-blue-500/50 to-transparent">
        {/* Rating badge */}
        <div className="absolute -top-4 left-5 flex items-center bg-white text-blue-600 px-3 py-1 rounded-full shadow-md text-sm font-medium">
          <FiStar className="fill-yellow-400 text-yellow-400 mr-1" size={14} />
          4.8
        </div>
        
        {/* Title and description */}
        <div className="text-white">
          <h3 className="text-lg font-semibold line-clamp-1">{image.title}</h3>
          <p className="text-sm text-blue-100 line-clamp-2 mt-1">
            {image.description}
          </p>
        </div>

        {/* Bottom info and button */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-blue-200">3 night stay</span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-blue-600 font-medium py-2 px-5 rounded-full text-sm hover:bg-blue-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Reserve
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;