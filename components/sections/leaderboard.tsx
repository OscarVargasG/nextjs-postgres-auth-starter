"use client";

import { Player } from "@/types/common";
import { motion } from "framer-motion";

// Props tipadas para el componente
interface LeaderboardProps {
  leaderboardData: Player[];
}

export default function Leaderboard({ leaderboardData }: LeaderboardProps) {
  return (
    <motion.div
      className="bg-white shadow-xl rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Tabla de Clasificación
        </h2>
        <ul className="space-y-2">
          {leaderboardData.map((player) => (
            <li
              key={player.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span className="text-gray-800">{player.name}</span>
              <span className="font-semibold text-indigo-600">
                {player.score}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
