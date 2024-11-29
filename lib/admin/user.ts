"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "../util";
import { User } from "@/types/common";

/**
 * Crear un nuevo usuario y asignarle todos los quizzes existentes.
 */
export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashPassword(password), // Asegúrate de hashear las contraseñas
    },
  });

  const quizzes = await prisma.quiz.findMany();

  // Asignar todos los quizzes existentes al usuario creado
  await prisma.userQuiz.createMany({
    data: quizzes.map((quiz) => ({
      userId: user.id,
      quizId: quiz.id,
    })),
  });

  return user;
}

/**
 * Actualizar un usuario por correo electrónico.
 */
export async function updateUserByEmail(
  email: string,
  updates: Partial<{ name: string; email: string; image: string }>
) {
  if (!email) {
    throw new Error("Email is required to update the user.");
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: updates,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return { user: updatedUser };
}

/**
 * Obtener todos los usuarios con su información básica.
 */
export async function getUsers() {
  const users: User[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return users;
}
