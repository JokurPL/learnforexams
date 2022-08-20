import { getSession } from "next-auth/react";

import * as React from "react";
import { useState } from "react";

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import prisma from "models";
import DashboardTemplate from "components/Template";

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

  return {
    props: {
      questions,
      exams,
    },
  };
};

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/JokurPL/">
        Mateusz Pietrzak
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Dashboard({ exams, questions, children }) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return <DashboardTemplate>polska gurom</DashboardTemplate>;
}
