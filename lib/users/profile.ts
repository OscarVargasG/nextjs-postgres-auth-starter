"use server";
import { prisma } from "@/lib/prisma";

/**
 * Retrieves a user by their email, excluding sensitive data like the password.
 * @param email The email of the user to retrieve.
 * @returns The user's basic information.
 * @throws Will throw an error if the user is not found.
 */
export async function getUserByEmail(email: string) {
  if (!email) {
    throw new Error("Email is required to fetch the user.");
  }

  // Fetch user by email, excluding sensitive fields
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true, // Include only safe fields
    },
  });

  if (!user) {
    throw new Error(`User with email ${email} not found.`);
  }

  return { user };
}

/**
 * Updates a user's information by their email.
 * @param email The email of the user to update.
 * @param updates An object containing the fields to update.
 * @returns The updated user's basic information.
 * @throws Will throw an error if the user is not found or if the update fails.
 */
export async function updateUserByEmail(
  email: string,
  updates: Partial<{ name: string; image: string }>
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
