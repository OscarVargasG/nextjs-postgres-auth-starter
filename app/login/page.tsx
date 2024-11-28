"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard", // Cambia la redirección aquí también
    });
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-white mb-4">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="example@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
