"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/UsersTable";
import QuizzesTable from "@/components/admin/QuizzesTable";
import DonationsTable from "@/components/admin/Donation";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showUsersSection, setShowUsersSection] = useState(true);
  const [showQuizSection, setShowQuizSection] = useState(false);
  const [showDonationsSection, setShowDonationsSection] = useState(false);

  useEffect(() => {
    if (session?.user?.email === "admin@admin.com") {
      setIsAdmin(true);
    } else if (session?.user) {
      redirect("/"); // Redirige a la página principal si no es admin
    }
  }, [session]);

  if (status === "loading" || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {/* Gestión de Usuarios */}
      <section className="mb-6">
        <button
          onClick={() => setShowUsersSection(!showUsersSection)}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full text-left"
        >
          {showUsersSection ? "▼" : "►"} Gestión de Usuarios
        </button>
        {showUsersSection && (
          <div className="mt-4">
            <UsersTable />
          </div>
        )}
      </section>

      {/* Crear Quiz */}
      <section className="mb-6">
        <button
          onClick={() => setShowQuizSection(!showQuizSection)}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full text-left"
        >
          {showQuizSection ? "▼" : "►"} Crear Quiz
        </button>
        {showQuizSection && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Crear Quiz</h2>
            {/* Aquí puedes agregar un formulario para crear quizzes */}
            <QuizzesTable />
          </div>
        )}
      </section>

      {/* Actualizar Donaciones */}
      <section className="mb-6">
        <button
          onClick={() => setShowDonationsSection(!showDonationsSection)}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full text-left"
        >
          {showDonationsSection ? "▼" : "►"} Actualizar Donaciones
        </button>
        {showDonationsSection && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Actualizar Donaciones
            </h2>
            {/* Aquí puedes agregar un formulario para actualizar donaciones */}
            <DonationsTable />
          </div>
        )}
      </section>
    </div>
  );
}
