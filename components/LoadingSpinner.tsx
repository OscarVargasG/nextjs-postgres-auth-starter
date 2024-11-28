"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <motion.div
        className="relative w-20 h-20"
        initial={{ scale: 0 }}
        animate={{ scale: [0.8, 1.2, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Círculos animados */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-400"
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        ></motion.div>
        <motion.div
          className="absolute top-0 left-0 w-4/5 h-4/5 rounded-full border-4 border-indigo-600"
          animate={{
            rotate: -360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        ></motion.div>
        <motion.div
          className="absolute top-0 left-0 w-3/5 h-3/5 rounded-full bg-indigo-500"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.6, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        ></motion.div>
      </motion.div>
      <p className="mt-6 text-lg font-semibold text-white animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
