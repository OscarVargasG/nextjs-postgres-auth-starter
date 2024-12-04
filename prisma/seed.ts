import { hashPassword } from "../lib/util";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Contraseña inicial para el administrador
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not set in the environment variables.");
  }

  const hashedPassword = await hashPassword(adminPassword);

  // Upsert del usuario administrador
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password: hashedPassword,
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&flip=true",
    },
  });

  console.log("Admin user created:", admin);

  // Datos de cuestionarios
  const quizzesData = [
    {
      title: "Generación X",
      description: "Explora los desafíos de los nacidos entre 1965 y 1980.",
      url: "https://quizizz.com/join?gc=39361984",
    },
    {
      title: "Millennials",
      description:
        "Descubre cómo los nacidos entre 1981 y 1996 enfrentan retos únicos.",
      url: "https://quizizz.com/join?gc=17079744",
    },
    {
      title: "Gen Z",
      description: "Conoce los desafíos de los nacidos entre 1997 y 2012.",
      url: "https://quizizz.com/join?gc=63217088",
    },
  ];

  const createdQuizzes = [];
  for (const quizData of quizzesData) {
    const quiz = await prisma.quiz.upsert({
      where: { title: quizData.title },
      update: {},
      create: quizData,
    });

    createdQuizzes.push(quiz);
  }

  console.log("Quizzes created.");

  // Datos de usuarios
  const usersData = [
    {
      email: "user1@example.com",
      name: "User 1",
      password: hashedPassword,
      image:
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true",
    },
    {
      email: "user2@example.com",
      name: "User 2",
      password: hashedPassword,
      image:
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&flip=true",
    },
    {
      email: "user3@example.com",
      name: "User 3",
      password: hashedPassword,
      image:
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true",
    },
  ];

  usersData.push({
    email: admin.email,
    name: admin.name,
    password: hashedPassword,
    image: admin.image,
  });

  const createdUsers = [];
  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    createdUsers.push(user);
  }

  console.log("Users created.");

  // Asignar cuestionarios a usuarios
  const userQuizzesData: Prisma.UserQuizCreateManyInput[] = [];

  for (const user of createdUsers) {
    for (const quiz of createdQuizzes) {
      userQuizzesData.push({
        userId: user.id,
        quizId: quiz.id,
        score: Math.floor(Math.random() * 100),
        completed: Math.random() < 0.5,
      });
    }
  }

  await prisma.userQuiz.createMany({
    data: userQuizzesData,
    skipDuplicates: true,
  });

  console.log("All quizzes assigned to all users.");

  // Crear objetivo global de donaciones
  const globalDonationGoal = await prisma.donationGoals.upsert({
    where: { id: "global-donation-goal" },
    update: {},
    create: {
      id: "global-donation-goal",
      goal: 10000,
    },
  });

  console.log("Global donation goal created:", globalDonationGoal);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
