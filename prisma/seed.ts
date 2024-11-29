import { hashPassword } from "../lib/util";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hash the password for the admin user
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return;

  const hashedPassword = await hashPassword(adminPassword);

  // Upsert the admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password: hashedPassword,
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&flip=true", // Optional avatar image
    },
  });

  console.log("Admin user created:", admin);

  // Create quizzes
  const quizzes = [
    {
      title: "Generación X",
      description: "Explora los desafíos de los nacidos entre 1965 y 1980.",
      link: "https://quizizz.com/join?gc=39361984",
    },
    {
      title: "Millennials",
      description:
        "Descubre cómo los nacidos entre 1981 y 1996 enfrentan retos únicos.",
      link: "https://quizizz.com/join?gc=17079744",
    },
    {
      title: "Gen Z",
      description: "Conoce los desafíos de los nacidos entre 1997 y 2012.",
      link: "https://quizizz.com/join?gc=63217088",
    },
  ];

  const createdQuizzes: Prisma.QuizCreateInput[] = [];
  for (const quiz of quizzes) {
    const createdQuiz = await prisma.quiz.create({
      data: {
        title: quiz.title,
        description: quiz.description,
      },
    });
    createdQuizzes.push(createdQuiz);
    console.log(`Quiz created: ${quiz.title}`);
  }

  // Create additional users
  const users = await prisma.user.createMany({
    data: [
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
    ],
    skipDuplicates: true,
  });

  console.log("Additional users created");

  // Create UserQuiz relationships with scores
  const allUsers = await prisma.user.findMany(); // Fetch all users
  const userQuizzes: Prisma.UserQuizCreateManyInput[] = [];

  allUsers.forEach((user) => {
    createdQuizzes.forEach((quiz) => {
      if (quiz.id) {
        userQuizzes.push({
          userId: user.id,
          quizId: quiz.id, // Ahora se garantiza que no sea undefined
          score: Math.floor(Math.random() * 100), // Genera una puntuación aleatoria entre 0 y 100
          completed: Math.random() > 0.5, // Marca el quiz como completado de forma aleatoria
        });
      }
    });
  });

  // Insert UserQuiz relationships
  await prisma.userQuiz.createMany({ data: userQuizzes });
  console.log("UserQuiz relationships created for all users and quizzes");

  // Create global donation goal
  const globalDonationGoal = await prisma.donationGoals.upsert({
    where: { id: "global-donation-goal" },
    update: {},
    create: {
      id: "global-donation-goal",
      goal: 10000, // Set an initial donation goal
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
