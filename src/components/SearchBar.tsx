import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../store/hooks';
import { setSearchQuery, clearImages } from '../store/slices/imageSlice';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(clearImages());
      dispatch(setSearchQuery(query.trim()));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    dispatch(clearImages());
    dispatch(setSearchQuery(null));
  };

  return (
    <div className="relative max-w-md w-full mx-auto">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-9 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        aria-label="Search images"
      />
      <motion.button
        onClick={clearSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        aria-label="Clear search"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        // Animate opacity and pointer events to keep space but hide visually and interactively
        animate={{ opacity: query ? 1 : 0 }}
        style={{ pointerEvents: query ? 'auto' : 'none' }}
        transition={{ duration: 0.2 }}
      >
        <FiX size={18} />
      </motion.button>
    </div>
  );
};

export default SearchBar;
