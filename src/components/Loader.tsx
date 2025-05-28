import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      className="flex items-center justify-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
            backgroundColor: ['#e5e7eb', '#3b82f6', '#e5e7eb'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          className="w-3 h-3 rounded-full bg-gray-200"
        />
      ))}
    </motion.div>
  );
};

export default Loader;