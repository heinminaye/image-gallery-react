import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../store/hooks';
import { setSearchQuery, clearImages } from '../store/slices/imageSlice';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearImages());
      dispatch(setSearchQuery(query || null));
    }, 500);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const clearSearch = () => {
    setQuery('');
    dispatch(clearImages());
    dispatch(setSearchQuery(null));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-md mx-auto mb-8"
    >
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;