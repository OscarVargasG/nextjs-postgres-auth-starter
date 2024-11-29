"use server";

import { prisma } from "@/lib/prisma";

/**
 * Update the global donation goal.
 */
export async function updateDonationStats(goal: number) {
  return prisma.donationStats.upsert({
    where: { id: "1" }, // Adjust the ID as needed for your database
    update: { goal },
    create: { id: "1", goal },
  });
}

/**
 * Register a donation by a specific user.
 */
export async function createUserDonation(userId: string, amount: number) {
  // Record the user's donation
  await prisma.userDonation.create({
    data: {
      userId,
      amount,
    },
  });

  // No need to update "current" in `DonationStats`, as it is calculated dynamically
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

  return total._sum.amount || 0; // Return 0 if no donations are registered
}

/**
 * Get global donation stats (goal and current total donations).
 */
export async function getDonationsStats() {
  // Fetch the global donation goal
  const donationStats = await prisma.donationStats.findUnique({
    where: { id: "1" }, // Adjust the ID as needed for your database
  });

  // Calculate the current total donations dynamically
  const currentTotal = await prisma.userDonation.aggregate({
    _sum: {
      amount: true,
    },
  });

  return {
    goal: donationStats?.goal || 0, // Default to 0 if no goal is set
    current: currentTotal._sum.amount || 0, // Default to 0 if no donations are registered
  };
}
