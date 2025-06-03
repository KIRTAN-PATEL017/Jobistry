import React from 'react';
import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const ComingSoon: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 to-white flex flex-col items-center justify-center text-center px-4">
      
      {/* Animated Plane */}
      <motion.div
        className="absolute top-1/3 left-0"
        animate={{
          x: [-200, window.innerWidth + 200],
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Plane className="text-sky-600 w-14 h-14 rotate-45" />
      </motion.div>

      {/* Animated Clouds */}
      <motion.div
        className="absolute top-10 left-[-100px] text-white opacity-40 text-3xl"
        animate={{ x: [-100, window.innerWidth + 300] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        ☁️ ☁️ ☁️
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-[-100px] text-white opacity-40 text-4xl"
        animate={{ x: [-100, window.innerWidth + 300] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        ☁️ ☁️
      </motion.div>

      {/* Text Content */}
      <motion.h1
        className="text-5xl font-extrabold text-sky-700 drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        Coming Soon
      </motion.h1>
      <p className="text-gray-600 mt-4 text-lg max-w-md">
        Buckle up! A brand new feature is on the way.
      </p>
    </div>
  );
};

export default ComingSoon;
