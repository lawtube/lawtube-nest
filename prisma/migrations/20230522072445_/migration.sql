/*
  Warnings:

  - Added the required column `issafe` to the `Feeds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sublink` to the `Feeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feeds" ADD COLUMN     "issafe" BOOLEAN NOT NULL,
ADD COLUMN     "sublink" TEXT NOT NULL;
