import { motion } from "framer-motion";
import { getImageUrl } from "../api/imageApi";
import { useState } from "react";
import type { Image } from "../models/images";
import { FiDownload, FiCalendar, FiEdit, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { downloadFile, formatDate } from "../utils/helpers";
import { useAppDispatch } from "../store/hooks";
import { deleteImageThunk } from "../store/slices/imageSlice";

interface ImageCardProps {
  image: Image;
  onClick: () => void;
  onEditClick: () => void;
}

const ImageCard = ({ image, onClick, onEditClick }: ImageCardProps) => {
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm('Are you sure you want to delete this image?')) {
      dispatch(deleteImageThunk(image.fileId));
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEditClick();
  };

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
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
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
          {/* <button
            className="p-2 z-40 bg-white/90 rounded-full cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(getImageUrl(image.fileId), image.fileId, image.title);
            }}
          >
            <FiDownload className="text-gray-700" size={16} />
          </button> */}
          
          {/* Three-dot menu */}
          <div className="relative">
            <button
              className="p-2 z-40 bg-white/90 rounded-full cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <FiMoreHorizontal className="text-gray-700" size={16} />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
              >
                <button
                  className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                 onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(getImageUrl(image.fileId), image.fileId, image.title);
                        }}
                >
                  <FiDownload className="mr-2" size={14} />
                  Download
                </button>
                <button
                  className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleEditClick}
                >
                  <FiEdit className="mr-2" size={14} />
                  Edit
                </button>
                <button
                  className="flex items-center cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="mr-2" size={14} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
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