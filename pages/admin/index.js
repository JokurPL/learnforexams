import { getSession } from "next-auth/react";
import prisma from "models";

import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems, SecondaryListItems } from "components/List";
import {
  Button,
  Input,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArticleIcon from "@mui/icons-material/Article";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import ExamsTable from "components/ExamsTable";
import QuestionTable from "components/QuestionsTable";

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

function DashboardContent({ exams, questions }) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem onClick={() => setIndex(0)} selected={index === 0} button>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Egzaminy" />
          </ListItem>
          <ListItem button onClick={() => setIndex(1)} selected={index === 1}>
            <ListItemIcon>
              <QuestionMarkIcon />
            </ListItemIcon>
            <ListItemText primary="Pytania" />
          </ListItem>
          <ListItem onClick={() => setIndex(2)} selected={index === 2} button>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Odpowiedzi" />
          </ListItem>
          <ListItem onClick={() => setIndex(3)} selected={index === 3} button>
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="Kategorie" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <SecondaryListItems exams={exams} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {index === 0 && (
            <>
              <Typography sx={{ mb: 2 }} align="center" variant="h3">
                Egzaminy
              </Typography>
              <ExamsTable data={exams} />
            </>
          )}

          {index === 1 && (
            <>
              <Typography sx={{ mb: 2 }} align="center" variant="h3">
                Pytania
              </Typography>
              <QuestionTable data={questions} exams={exams} />
            </>
          )}

          {index === 2 && (
            <>
              <Typography sx={{ mb: 2 }} align="center" variant="h3">
                Odpowiedzi
              </Typography>
              <ExamsTable data={exams} />
            </>
          )}

          {index === 3 && (
            <>
              <Typography sx={{ mb: 2 }} align="center" variant="h3">
                Kategorie
              </Typography>
              <ExamsTable data={exams} />
            </>
          )}

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard({ exams, questions }) {
  return <DashboardContent exams={exams} questions={questions} />;
}
