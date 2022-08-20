// export default function ()
import { Typography } from "@mui/material";
import ExamsTable from "components/ExamsTable";
import QuestionTable from "components/QuestionsTable";
import DashboardTemplate from "components/Template";
import { getSession } from "next-auth/react";

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      notFound: true,
    };
  }

  const email = session.user?.email;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      isAdmin: true,
    },
  });

  if (user.isAdmin === false) {
    return {
      notFound: true,
    };
  }

  try {
    const exams = await prisma.exams.findMany({
      orderBy: [
        {
          id: "desc",
        },
      ],
      include: {
        examCategory: true,
      },
    });

    const questionsRAW = await prisma.questions.findMany({
      include: {
        Exercise: true,
      },
    });

    const examsForQuestions = await prisma.exams.findMany({
      include: {
        examCategory: true,
      },
    });

    const questions = questionsRAW.map((question) => {
      let exam = examsForQuestions.filter(
        (exam) => exam.id === question.Exercise[0].examId
      )[0];

      return {
        ...question,
        exam,
      };
    });
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      questions,
      exams,
    },
  };
};

export default function ExamsDashboard({ questions, exams }) {
  return (
    <DashboardTemplate>
      <Typography sx={{ mb: 2 }} align="center" variant="h3">
        Pytania
      </Typography>
      <QuestionTable data={questions} exams={exams} />
    </DashboardTemplate>
  );
}
