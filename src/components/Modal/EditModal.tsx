import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { FiTrash2, FiUpload } from "react-icons/fi";
import { useAppDispatch } from "../../store/hooks";
import { updateImageMetadataThunk, uploadImageThunk } from "../../store/slices/imageSlice";
import toast from "react-hot-toast";
import type { Image } from "../../models/images";
import { getImageUrl } from "../../api/imageApi";

interface ImageEditModalProps {
  image: Image | null;
  onClose: () => void;
}

const acceptedFileTypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const maxFileSize = 10 * 1024 * 1024; // 10MB

const ImageEditModal = ({ image, onClose }: ImageEditModalProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description || "");
      setNewFile(null);
      setError(null);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [image]);

  useEffect(() => {
    // Create preview URL when new file is selected
    if (newFile) {
      const objectUrl = URL.createObjectURL(newFile);
      setPreviewUrl(objectUrl);

      // Clean up
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [newFile]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        toast.error(`File too large. Max size is ${maxFileSize / 1024 / 1024}MB`);
      } else {
        toast.error("Only JPEG, PNG, WEBP images are allowed");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setNewFile(file);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize: maxFileSize,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (newFile) {
        // Update with new file
        await dispatch(
          uploadImageThunk({
            file: newFile,
            title: title.trim(),
            description: description.trim(),
          })
        ).unwrap();
        toast.success("Image and details updated successfully");
      } else {
        // Update metadata only
        await dispatch(
          updateImageMetadataThunk({
            fileId: image.fileId,
            title: title.trim(),
            description: description.trim(),
          })
        ).unwrap();
        toast.success("Image details updated successfully");
      }
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-labelledby="edit-modal-title"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-lg border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2
              id="edit-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              Edit Image
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image dropzone/preview */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 bg-white"
                } ${error ? "border-red-500 bg-red-50" : ""}`}
                aria-label="Image upload dropzone"
              >
                <input {...getInputProps()} />

                {newFile ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={previewUrl || ""}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 transition-colors"
                      aria-label="Remove file"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-full h-48 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={getImageUrl(image.fileId)}
                        alt={image.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center space-y-2 select-none">
                      <FiUpload size={24} className="text-gray-400" />
                      <p className="font-medium text-gray-700">
                        {isDragActive
                          ? "Drop the new image here"
                          : "Drag & drop to replace image"}
                      </p>
                      <p className="text-xs text-gray-500">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports:{" "}
                        {Object.values(acceptedFileTypes).flat().join(", ")}{" "}
                        (Max {maxFileSize / 1024 / 1024}MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start">
                  <FiTrash2 className="flex-shrink-0 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    required
                    placeholder="Enter image title"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Add a description for your image..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                
                <button
                  type="submit"
                  className={`flex-1 cursor-pointer py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageEditModal;