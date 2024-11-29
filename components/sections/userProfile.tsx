"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { avatarOptions } from "@/const/common";
import { updateUserByEmail } from "@/lib/users/profile";
import { UserSession } from "@/types/common";

interface UserProfileProps {
  userSession: UserSession;
  setUserSession: (updatedUser: UserSession) => void;
}

export default function UserProfile({
  userSession,
  setUserSession,
}: UserProfileProps) {
  const [username, setUsername] = useState(userSession.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    userSession.image || undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardar cambios en el servidor
  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (userSession.email) {
        const updates = { name: username, image: selectedAvatar };

        // Actualizar datos en el servidor
        await updateUserByEmail(userSession.email, updates);

        // Actualizar el estado global del usuario
        setUserSession({
          ...userSession,
          name: updates.name,
          image: updates.image,
        });

        alert("Perfil actualizado exitosamente!");
      }
    } catch (err) {
      console.error("Error actualizando datos del usuario:", err);
      setError("No se pudo actualizar la información del usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
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
            src={selectedAvatar || "/default-avatar.png"} // Imagen por defecto si no hay avatar seleccionado
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
              className={`p-1 rounded-full flex items-center justify-center ${
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
        <button
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={handleSaveChanges}
        >
          Guardar Cambios
        </button>
      </div>
    </motion.div>
  );
}
