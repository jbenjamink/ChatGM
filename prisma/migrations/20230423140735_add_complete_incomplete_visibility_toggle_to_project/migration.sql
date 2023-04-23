-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "showCompletedTasks" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showIncompleteTasks" BOOLEAN NOT NULL DEFAULT true;
