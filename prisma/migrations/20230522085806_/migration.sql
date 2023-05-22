-- AlterTable
ALTER TABLE "Feeds" ALTER COLUMN "videolink" DROP NOT NULL,
ALTER COLUMN "issafe" DROP NOT NULL,
ALTER COLUMN "sublink" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WorkProgress" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "doHighlight" BOOLEAN NOT NULL,
    "doSubtitle" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videolink" TEXT,
    "sublink" TEXT,
    "issafe" BOOLEAN,

    CONSTRAINT "WorkProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkProgress_token_key" ON "WorkProgress"("token");

-- AddForeignKey
ALTER TABLE "WorkProgress" ADD CONSTRAINT "WorkProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
