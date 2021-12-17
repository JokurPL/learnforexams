import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// console.log(prisma);

export const {
  examsCategories,
  answers,
  questions,
  exercise,
  answersToExercise,
  exams,
} = prisma;