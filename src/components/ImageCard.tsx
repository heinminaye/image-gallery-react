import { motion } from "framer-motion";
import { getImageUrl } from "../api/imageApi";
import { useState } from "react";
import type { Image } from "../models/images";
import { FiDownload, FiCalendar, FiImage } from "react-icons/fi";
import { downloadFile, formatDate } from "../utils/helpers";

interface ImageCardProps {
  image: Image;
  onClick: () => void;
}

const ImageCard = ({ image, onClick }: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Extract file extension from contentType
  const fileType = image.contentType?.split("/")[1]?.toUpperCase() || "";

  const typeColorMap: Record<string, string> = {
    JPEG: "bg-yellow-100 text-yellow-800",
    PNG: "bg-blue-100 text-blue-800",
    WEBP: "bg-green-100 text-green-800",
    SVG: "bg-purple-100 text-purple-800",
    GIF: "bg-pink-100 text-pink-800",
    DEFAULT: "bg-gray-100 text-gray-800",
  };

  const typeClass = typeColorMap[fileType] || typeColorMap.DEFAULT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.1 }}
      whileHover={{
        scale: 1.03,
        zIndex: 10,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
      className="relative rounded-2xl cursor-pointer overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with hover zoom */}
      <div className="relative h-56 w-full overflow-hidden p-2">
        <motion.img
          src={getImageUrl(image.fileId)}
          alt={image.title}
          className="h-full w-full object-cover rounded-xl"
          initial={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          onLoad={() => setLoaded(true)}
        />

        {/* Top-right actions */}
        <motion.div
          className="absolute top-4 right-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? 0 : -1,
          }}
        >
          <button
            className="p-2 z-40 bg-white/90 rounded-full cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(getImageUrl(image?.fileId), image.fileId, image.title);
            }}
          >
            <FiDownload className="text-gray-700" size={16} />
          </button>
        </motion.div>

        {/* Date badge */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <FiCalendar size={12} />
          <span>{formatDate(image.uploadDate)}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 pt-3 pb-5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            {/* Title with ellipsis */}
            <h3 className="text-md font-bold text-gray-900 truncate">
              {image.title}
            </h3>

            {/* Description with ellipsis */}
            <p className="text-sm text-gray-500 truncate">
              {image.description}
            </p>
          </div>

          {/* Modern file type badge */}
          <div
            className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl shadow-inner backdrop-blur-md ${typeClass}`}
          >
            <span className="text-xs font-bold">{fileType}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
