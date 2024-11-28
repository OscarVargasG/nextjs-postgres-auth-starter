import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/util";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Create user
    await createUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Function to create a user in the database
async function createUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ errors: ["Password length should be more than 6 characters"] });
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: await hashPassword(password), // Ensure password is hashed
      },
    });
    return res.status(201).json({ user });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    console.error("Error creating user:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
