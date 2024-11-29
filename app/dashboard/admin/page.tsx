"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email === "admin@admin.com") {
      setIsAdmin(true);
    } else if (session?.user) {
      redirect("/"); // Redirect to the main page if not admin
    }
  }, [session]);

  if (status === "loading" || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ← Volver al Dashboard
        </button>
      </div>

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
          {showQuizSection ? "▼" : "►"} Gestión de Quizes
        </button>
        {showQuizSection && (
          <div className="mt-4">
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
          {showDonationsSection ? "▼" : "►"} Gestión de Donaciones
        </button>
        {showDonationsSection && (
          <div className="mt-4">
            <DonationsTable />
          </div>
        )}
      </section>
    </div>
  );
}
