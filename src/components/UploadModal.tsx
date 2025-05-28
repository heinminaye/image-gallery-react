import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { useAppDispatch } from "../store/hooks";
import { uploadImageThunk } from "../store/slices/imageSlice";
import { FiUpload, FiImage, FiX, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const acceptedFileTypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const maxFileSize = 10 * 1024 * 1024; // 10MB

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          toast.error(`File too large. Max size is ${maxFileSize / 1024 / 1024}MB`);
        } else {
          toast.error("Only JPEG, PNG, WEBP images are allowed");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        setError(null);
        if (!title) {
          setTitle(file.name.split(".")[0]);
        }
      }
    },
    [title]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize: maxFileSize,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image file");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await dispatch(
        uploadImageThunk({
          file,
          title: title.trim(),
          description: description.trim(),
        })
      ).unwrap();

      resetForm();
      onClose();
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setError(null);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setTitle("");
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="upload-modal-title"
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
              <h2 id="upload-modal-title" className="text-lg font-semibold text-gray-900">
                Upload Image
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
                {/* Dropzone */}
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

                  {file ? (
                    <div className="relative flex flex-col items-center space-y-3">
                      <FiImage size={36} className="text-blue-600" />
                      <p className="font-semibold text-gray-900 truncate max-w-full w-48">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB · {file.type.split('/')[1].toUpperCase()}
                      </p>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-0 cursor-pointer right-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white text-gray-600 transition-colors"
                        aria-label="Remove file"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 select-none">
                      <FiUpload size={36} className="text-gray-400" />
                      <p className="font-medium text-gray-700">
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop an image here"}
                      </p>
                      <p className="text-xs text-gray-500">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports: {Object.values(acceptedFileTypes)
                          .flat()
                          .join(', ')} (Max {maxFileSize / 1024 / 1024}MB)
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start">
                    <FiX className="flex-shrink-0 mr-2 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="image-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="image-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      required
                      placeholder="Enter image title"
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label htmlFor="image-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="image-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="Add a description for your image..."
                      disabled={isUploading}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={!file || !title.trim() || !description.trim() || isUploading}
                    className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                      !file || !title.trim() || !description.trim() || isUploading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isUploading ? (
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
                        Uploading...
                      </span>
                    ) : (
                      "Upload Image"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;