-- CreateTable
CREATE TABLE "ExamsCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "ExamsCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answers" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "img" TEXT,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "img" TEXT,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswersToExercise" (
    "id" SERIAL NOT NULL,
    "is_good" BOOLEAN NOT NULL,
    "answersId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "AnswersToExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exams" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "examsCategoriesId" INTEGER NOT NULL,

    CONSTRAINT "Exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamsCategories_name_key" ON "ExamsCategories"("name");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersToExercise" ADD CONSTRAINT "AnswersToExercise_answersId_fkey" FOREIGN KEY ("answersId") REFERENCES "Answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersToExercise" ADD CONSTRAINT "AnswersToExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exams" ADD CONSTRAINT "Exams_examsCategoriesId_fkey" FOREIGN KEY ("examsCategoriesId") REFERENCES "ExamsCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
