import { Typography } from "@mui/material";
import ExamsTable from "components/ExamsTable";
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

  return {
    props: {
      exams,
    },
  };
};

export default function ExamsDashboard({ exams }) {
  return (
    <DashboardTemplate exams={exams}>
      <Typography sx={{ mb: 2 }} align="center" variant="h3">
        Egzaminy
      </Typography>
      <ExamsTable data={exams} />
    </DashboardTemplate>
  );
}
