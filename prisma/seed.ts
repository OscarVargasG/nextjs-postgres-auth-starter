import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash the password for the admin user
  const password = await hash("password123", 12);

  // Upsert the admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password,
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&flip=true", // Optional avatar image
    },
  });

  console.log("Admin user created:", admin);

  // Create sample quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "General Knowledge Quiz",
      description: "Test your general knowledge with this quiz!",
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: "Math Quiz",
      description: "A challenging quiz to test your math skills.",
    },
  });

  console.log("Quizzes created:", { quiz1, quiz2 });

  // Create additional users
  const users = await prisma.user.createMany({
    data: [
      {
        email: "user1@example.com",
        name: "User 1",
        password: await hash("password123", 12),
        image:
          "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true",
      },
      {
        email: "user2@example.com",
        name: "User 2",
        password: await hash("password123", 12),
        image:
          "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&flip=true",
      },
      {
        email: "user3@example.com",
        name: "User 3",
        password: await hash("password123", 12),
        image:
          "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Additional users created");

  // Create UserQuiz relationships with scores
  const userQuizzes = await prisma.userQuiz.createMany({
    data: [
      {
        userId: admin.id,
        quizId: quiz1.id,
        score: 85,
        completed: true,
      },
      {
        userId: admin.id,
        quizId: quiz2.id,
        score: 90,
        completed: true,
      },
      {
        userId: (await prisma.user.findUnique({
          where: { email: "user1@example.com" },
        }))!.id,
        quizId: quiz1.id,
        score: 70,
        completed: true,
      },
      {
        userId: (await prisma.user.findUnique({
          where: { email: "user2@example.com" },
        }))!.id,
        quizId: quiz2.id,
        score: 80,
        completed: true,
      },
      {
        userId: (await prisma.user.findUnique({
          where: { email: "user3@example.com" },
        }))!.id,
        quizId: quiz1.id,
        score: 95,
        completed: true,
      },
    ],
  });

  console.log("UserQuiz relationships created:", userQuizzes);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
