"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // Cambiado <img> a <Image>
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const [username, setUsername] = useState("Jugador");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const progress = 65; // `setProgress` eliminado porque no es usado

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ¡Bienvenido, {username}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Editar Perfil
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={selectedAvatar}
                  alt="Avatar Seleccionado"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-1 rounded-full ${
                      selectedAvatar === avatar ? "ring-2 ring-indigo-500" : ""
                    }`}
                  >
                    <Image
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </button>
                ))}
              </div>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Guardar Cambios
              </button>
            </div>
          </motion.div>
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
        </div>
        <motion.div
          className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tu Progreso
            </h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Progreso de Nivel
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <h1>Client Session</h1>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}

const avatarOptions = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&flip=true",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan&flip=true",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Mason&flip=true",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&flip=true",
];

const leaderboardData = [
  { id: 1, name: "Jugador 1", score: 1000 },
  { id: 2, name: "Jugador 2", score: 950 },
  { id: 3, name: "Jugador 3", score: 900 },
  { id: 4, name: "Jugador 4", score: 850 },
  { id: 5, name: "Jugador 5", score: 800 },
];
