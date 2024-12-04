-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn&flip=true',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationGoals" (
    "id" TEXT NOT NULL DEFAULT 'global-donation-stats',
    "goal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDonation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "donationStatsId" TEXT NOT NULL DEFAULT 'global-donation-goal',
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_title_key" ON "Quiz"("title");

-- AddForeignKey
ALTER TABLE "UserQuiz" ADD CONSTRAINT "UserQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuiz" ADD CONSTRAINT "UserQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_donationStatsId_fkey" FOREIGN KEY ("donationStatsId") REFERENCES "DonationGoals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
