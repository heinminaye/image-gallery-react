import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: i * 0.2,
          }}
          className="w-3 h-3 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  );
};

export default Loader;