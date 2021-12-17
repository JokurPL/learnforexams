/*
  Warnings:

  - You are about to drop the `Answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnswersToExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamsCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnswersToExercise" DROP CONSTRAINT "AnswersToExercise_answersId_fkey";

-- DropForeignKey
ALTER TABLE "AnswersToExercise" DROP CONSTRAINT "AnswersToExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Exams" DROP CONSTRAINT "Exams_examsCategoriesId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_examId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_questionId_fkey";

-- DropTable
DROP TABLE "Answers";

-- DropTable
DROP TABLE "AnswersToExercise";

-- DropTable
DROP TABLE "Exams";

-- DropTable
DROP TABLE "ExamsCategories";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "Questions";

-- CreateTable
CREATE TABLE "exams_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "exams_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "img" TEXT,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "img" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers_to_exercise" (
    "id" SERIAL NOT NULL,
    "is_good" BOOLEAN NOT NULL,
    "answersId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "answers_to_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "examsCategoriesId" INTEGER NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_categories_name_key" ON "exams_categories"("name");

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers_to_exercise" ADD CONSTRAINT "answers_to_exercise_answersId_fkey" FOREIGN KEY ("answersId") REFERENCES "answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers_to_exercise" ADD CONSTRAINT "answers_to_exercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_examsCategoriesId_fkey" FOREIGN KEY ("examsCategoriesId") REFERENCES "exams_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
