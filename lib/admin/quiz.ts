"use server";

import { prisma } from "@/lib/prisma";

/**
 * Crear un nuevo quiz y asignarlo a todos los usuarios existentes.
 */
export async function createQuiz(title: string, description: string) {
  const quiz = await prisma.quiz.create({
    data: { title, description },
  });

  const users = await prisma.user.findMany();

  // Asignar el quiz creado a todos los usuarios existentes
  await prisma.userQuiz.createMany({
    data: users.map((user) => ({
      userId: user.id,
      quizId: quiz.id,
    })),
  });

  return quiz;
}

/**
 * Obtener todos los quizzes.
 */
export async function getQuizzes() {
  return prisma.quiz.findMany({
    include: {
      userQuizzes: {
        select: {
          id: true,
          userId: true,
          score: true,
          link: true, // This is already included and matches the updated type
          user: { select: { name: true, email: true } },
        },
      },
    },
  });
}

/**
 * Actualizar un quiz (título y descripción).
 */
export async function updateQuiz(
  quizId: string,
  updates: Partial<{ title: string; description: string }>
) {
  return prisma.quiz.update({
    where: { id: quizId },
    data: updates,
  });
}

/**
 * Obtener usuarios asignados a un quiz.
 */
export async function getUsersByQuiz(quizId: string) {
  const userQuizzes = await prisma.userQuiz.findMany({
    where: { quizId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Map the response to match the QuizUser type
  return userQuizzes.map((userQuiz) => ({
    id: userQuiz.id,
    userId: userQuiz.userId, // Add userId explicitly
    user: {
      name: userQuiz.user.name,
      email: userQuiz.user.email,
    },
    score: userQuiz.score,
    link: userQuiz.link || null,
  }));
}

/**
 * Actualizar los puntajes de un usuario en un quiz específico.
 */
export async function updateUserScore(
  userId: string,
  quizId: string,
  score: number
) {
  return prisma.userQuiz.updateMany({
    where: { userId, quizId },
    data: { score },
  });
}

/**
 * Actualizar el enlace de un `UserQuiz`.
 */
export async function updateUserQuizLink(
  userId: string,
  quizId: string,
  link: string
) {
  return prisma.userQuiz.updateMany({
    where: { userId, quizId },
    data: { link },
  });
}

/**
 * Get quizzes assigned to a specific user by their email.
 * @param email - The email of the user.
 * @returns List of quizzes with relevant details.
 */
export async function getQuizzesByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const userQuizzes = await prisma.userQuiz.findMany({
    where: { userId: user.id },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });

  return userQuizzes.map((userQuiz) => ({
    id: userQuiz.quiz.id,
    title: userQuiz.quiz.title,
    description: userQuiz.quiz.description,
    createdAt: userQuiz.quiz.createdAt,
    score: userQuiz.score,
    link: userQuiz.link || null,
  }));
}
