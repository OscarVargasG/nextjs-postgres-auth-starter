/*
  Warnings:

  - You are about to drop the column `current` on the `DonationStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DonationStats" DROP COLUMN "current",
ALTER COLUMN "id" SET DEFAULT 'global-donation-stats';

-- AlterTable
ALTER TABLE "UserDonation" ADD COLUMN     "donationStatsId" TEXT NOT NULL DEFAULT 'global-donation-stats';

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_donationStatsId_fkey" FOREIGN KEY ("donationStatsId") REFERENCES "DonationStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
