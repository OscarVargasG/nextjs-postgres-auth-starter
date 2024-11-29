"use server";

import { prisma } from "@/lib/prisma";

/**
 * Obtiene todos los usuarios y sus quizzes asignados, incluyendo detalles.
 * @returns Lista de usuarios con quizzes y detalles del leaderboard.
 */
export async function getUsersWithQuizzes() {
  const users = await prisma.user.findMany({
    include: {
      quizzes: {
        include: {
          quiz: true,
        },
      },
    },
  });

  const leaderboard = users
    .map((user) => ({
      name: user.name,
      score: user.quizzes.reduce((acc, userQuiz) => acc + userQuiz.score, 0),
    }))
    .sort((a, b) => b.score - a.score);

  return { users, leaderboard };
}

/**
 * Fetch all quizzes along with their assigned users and details.
 * @returns List of quizzes with user details.
 */
export async function getQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      userQuizzes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    createdAt: quiz.createdAt,
    userQuizzes: quiz.userQuizzes.map((userQuiz) => ({
      id: userQuiz.id,
      userId: userQuiz.userId,
      user: {
        name: userQuiz.user.name,
        email: userQuiz.user.email,
      },
      score: userQuiz.score,
      link: userQuiz.link || null,
    })),
  }));
}
