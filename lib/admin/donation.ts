"use server";

import { prisma } from "@/lib/prisma";

/**
 * Update the global donation goal.
 */
export async function updateDonationGoal(goal: number) {
  return prisma.donationGoals.upsert({
    where: { id: "global-donation-stats" }, // ID fijo del registro global
    update: { goal },
    create: { id: "global-donation-stats", goal },
  });
}

/**
 * Register a donation by a specific user.
 */
export async function createUserDonation(userId: string, amount: number) {
  // Record the user's donation
  return prisma.userDonation.create({
    data: {
      userId,
      amount,
    },
  });
}

/**
 * Get all registered donations with user details.
 */
export async function getDonations() {
  const donations = await prisma.userDonation.findMany({
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

  return donations.map((donation) => ({
    id: donation.id,
    amount: donation.amount,
    createdAt: donation.createdAt,
    user: {
      id: donation.user.id,
      name: donation.user.name,
      email: donation.user.email,
    },
  }));
}

/**
 * Calculate the total donations dynamically.
 */
export async function calculateCurrentDonations() {
  const total = await prisma.userDonation.aggregate({
    _sum: {
      amount: true,
    },
  });

  return total._sum.amount || 0; // Retorna 0 si no hay donaciones registradas
}

/**
 * Get the current donation goal.
 */
export async function getDonationGoal() {
  const donationGoal = await prisma.donationGoals.findFirst(); // Obtiene el primer registro disponible

  return donationGoal?.goal || 0; // Retorna 0 si no hay meta establecida
}

/**
 * Get donation stats (goal and current total donations).
 */
export async function getDonationsStats() {
  const goal = await getDonationGoal(); // Usa la función de getDonationGoal

  // Calculate the current total donations dynamically
  const currentTotal = await prisma.userDonation.aggregate({
    _sum: {
      amount: true,
    },
  });

  return {
    goal,
    current: currentTotal._sum.amount || 0, // Default a 0 si no hay donaciones registradas
  };
}

/**
 * Update the first donation goal.
 */
export async function updateDonationGoalFirst(goal: number) {
  // Find the first donation goal
  const donationGoal = await prisma.donationGoals.findFirst();

  if (!donationGoal) {
    // If no goal exists, create a new one
    return prisma.donationGoals.create({
      data: {
        goal,
      },
    });
  }

  // If a goal exists, update it
  return prisma.donationGoals.update({
    where: { id: donationGoal.id },
    data: { goal },
  });
}
