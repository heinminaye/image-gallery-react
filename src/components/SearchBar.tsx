import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../store/hooks';
import { setSearchQuery, clearImages } from '../store/slices/imageSlice';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    dispatch(clearImages());
    dispatch(setSearchQuery(query.trim()));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <motion.div 
        className={`flex items-center w-full bg-white border-1 rounded-xl border-blue-400 ${isFocused ? 'border-blue-500' : 'border-gray-200'} overflow-hidden shadow-xs`}
      >
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-2.5 focus:outline-none text-sm placeholder-gray-400 bg-transparent"
        />

        <div className="flex items-center pr-1">
          {query && (
            <motion.button
              onClick={clearSearch}
              className="p-1 text-gray-400 cursor-pointer hover:text-gray-600 mr-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FiX size={16} />
            </motion.button>
          )}

          <motion.button
            onClick={handleSearch}
            className={`p-2 cursor-pointer rounded-lg bg-blue-500 text-white`}
          >
            <FiSearch size={16} className='text-white' />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;