/*
  Warnings:

  - A unique constraint covering the columns `[feedsId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_feedsId_userId_key" ON "Like"("feedsId", "userId");
