"use server";

import { prisma } from "@/lib/prisma";

/**
 * Crear un nuevo quiz con URL.
 */
export async function createQuiz(
  title: string,
  description: string,
  url: string
) {
  return prisma.quiz.create({
    data: { title, description, url },
  });
}

/**
 * Obtener todos los quizzes con usuarios asignados.
 */
export async function getQuizzes() {
  return prisma.quiz.findMany({
    include: {
      userQuizzes: {
        select: {
          id: true,
          userId: true,
          score: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  });
}

/**
 * Actualizar un quiz (título, descripción y URL).
 */
export async function updateQuiz(
  quizId: string,
  updates: Partial<{ title: string; description: string; url: string }>
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

  return userQuizzes.map((userQuiz) => ({
    id: userQuiz.id,
    userId: userQuiz.userId,
    user: {
      name: userQuiz.user.name,
      email: userQuiz.user.email,
    },
    score: userQuiz.score,
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
          url: true,
          createdAt: true,
        },
      },
    },
  });

  return userQuizzes.map((userQuiz) => ({
    id: userQuiz.quiz.id,
    title: userQuiz.quiz.title,
    description: userQuiz.quiz.description,
    url: userQuiz.quiz.url,
    createdAt: userQuiz.quiz.createdAt,
    score: userQuiz.score,
  }));
}
