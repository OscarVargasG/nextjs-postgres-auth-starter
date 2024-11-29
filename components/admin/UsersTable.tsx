"use client";

import { createUser, getUsers, updateUserByEmail } from "@/lib/admin/user";
import { User } from "@/types/common";
import { useState, useEffect } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // allow null
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response) setUsers(response);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await createUser(email, name, password);
      alert("User crated.");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser?.email) {
        await updateUserByEmail(selectedUser.email, { name, email });
        alert("User updated.");
        setIsEditing(false);
        setSelectedUser(null);
        setEmail("");
        setName("");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleEditUser = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setEmail(user.email);
    setName(user.name);
  };

  const switchToCreateMode = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </h3>
          {isEditing && (
            <button
              onClick={switchToCreateMode}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear Usuario
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        {!isEditing && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
        )}
        <button
          onClick={isEditing ? handleSaveUser : handleCreateUser}
          className={`${
            isEditing ? "bg-green-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
        >
          {isEditing ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </div>
  );
}
