"use server";

import { prisma } from "@/lib/prisma";

/**
 * Obtiene todos los usuarios y sus quizzes asignados, incluyendo detalles.
 * @returns Lista de usuarios con quizzes y detalles del leaderboard.
 */
export async function getLeaderboard() {
  console.log("getLeaderboard");
  const users = await prisma.user.findMany({
    include: {
      quizzes: {
        select: {
          score: true,
        },
      },
    },
  });

  const leaderboard = users
    .map((user) => ({
      id: user.id,
      name: user.name,
      score: user.quizzes.reduce((acc, quiz) => acc + quiz.score, 0),
    }))
    .sort((a, b) => b.score - a.score);

  return leaderboard;
}
