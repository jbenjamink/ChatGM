-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gpt4ApiKey" TEXT,
ADD COLUMN     "useGPT4" BOOLEAN NOT NULL DEFAULT false;