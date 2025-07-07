import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../store/hooks';
import { setSearchQuery, clearImages } from '../store/slices/imageSlice';
import { FiSearch, FiX } from 'react-icons/fi';

type SearchBarProps = {
  disabled?: boolean;
};

const SearchBar = ({ disabled }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    if (!disabled) {
      dispatch(clearImages());
      dispatch(setSearchQuery(query.trim()));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setQuery('');
    if (!disabled) {
      dispatch(clearImages());
      dispatch(setSearchQuery(''));
    }
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
          disabled={disabled}
          className="w-full px-4 py-2.5 focus:outline-none text-sm placeholder-gray-400 bg-transparent disabled:opacity-50"
        />

        <div className="flex items-center pr-1">
          {query && (
            <motion.button
              onClick={clearSearch}
              disabled={disabled}
              className="p-1 text-gray-400 cursor-pointer hover:text-gray-600 mr-1 disabled:opacity-40"
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
            disabled={disabled}
            className="p-2 cursor-pointer rounded-lg bg-blue-500 text-white disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            <FiSearch size={16} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;