import { Typography } from "@mui/material";
import ExamsTable from "components/ExamsTable";
import DashboardTemplate from "components/Template";
import prisma from "models";
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

  const examCategories = await prisma.examsCategories.findMany();

  return {
    props: {
      exams,
      examCategories,
    },
  };
};

export default function ExamsDashboard({ exams, examCategories }) {
  return (
    <DashboardTemplate>
      <Typography sx={{ mb: 2 }} align="center" variant="h3">
        Egzaminy
      </Typography>
      <ExamsTable data={exams} examCategories={examCategories} />
    </DashboardTemplate>
  );
}
