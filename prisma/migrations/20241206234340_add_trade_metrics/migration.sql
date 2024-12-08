/*
  Warnings:

  - The `strategy` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `sentiment` on table `Trade` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "hourOfDay" INTEGER,
ADD COLUMN     "profitFactor" DOUBLE PRECISION,
DROP COLUMN "strategy",
ADD COLUMN     "strategy" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "sentiment" SET NOT NULL;
