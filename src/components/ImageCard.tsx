import { motion } from 'framer-motion';
import { getImageUrl } from '../api/imageApi';
import { useState } from 'react';
import type { Image } from '../models/images';

interface ImageCardProps {
  image: Image;
  onClick: () => void;
}

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative pb-[100%] bg-gray-200">
        <img
          src={getImageUrl(image.fileId)}
          alt={image.title}
          className="absolute h-full w-full object-cover"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{image.title}</h3>
        <p className="text-gray-600 text-sm truncate">{image.description}</p>
      </div>
    </motion.div>
  );
};

export default ImageCard;