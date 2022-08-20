import { Typography } from "@mui/material";
import CategoriesTable from "components/CategoriesTable";
import DashboardTemplate from "components/Template";
import { getSession } from "next-auth/react";
import prisma from "models";

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

  const categories = await prisma.examsCategories.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      _count: true,
    },
  });

  return {
    props: {
      categories,
    },
  };
};

export default function ExamsDashboard({ categories }) {
  return (
    <DashboardTemplate>
      <Typography sx={{ mb: 2 }} align="center" variant="h3">
        Kategorie
      </Typography>
      <CategoriesTable data={categories} />
    </DashboardTemplate>
  );
}
