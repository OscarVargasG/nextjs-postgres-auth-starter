"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function WelcomeScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { status } = useSession();
  const router = useRouter();

  // Verifica si el usuario está activo y redirige a /dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col justify-center items-center p-4">
      <motion.h1
        className="text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ¡Bienvenido a este pequeño juego!
      </motion.h1>
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Cómo jugar
        </h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg ${
                currentStep === index ? "bg-indigo-100" : "bg-gray-100"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            disabled={currentStep === 0}
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </motion.div>
      <Link
        href="/login"
        className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 transition-colors"
      >
        Empezar a jugar
      </Link>
    </div>
  );
}

const steps = [
  {
    title: "Crea tu perfil",
    description: "Personaliza tu avatar y nombre de usuario",
  },
  {
    title: "Completa desafíos",
    description: "Gana puntos al completar tareas del juego",
  },
  {
    title: "Sube en la tabla de clasificación",
    description: "Compite con otros jugadores por el primer lugar",
  },
];
