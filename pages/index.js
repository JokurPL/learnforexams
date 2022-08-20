import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyIcon from "@mui/icons-material/Key";
import QuizIcon from "@mui/icons-material/Quiz";
import HandymanIcon from "@mui/icons-material/Handyman";
import EditIcon from "@mui/icons-material/Edit";
import prisma from "models";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const getServerSideProps = async ({ req }) => {
  try {
    const examsCategories = await prisma.examsCategories.findMany();
    const exams = await prisma.exams.findMany();

    return {
      props: {
        examsCategories,
        exams,
      },
    };
  } catch (error) {
    return {
      props: {
        error_message: error.message,
      },
    };
  }
};

export default function Home({ examsCategories, exams, error_message }) {
  const [value, setValue] = useState(0);

  const { data: session } = useSession();

  const getExamCategory = (categoryId) => {
    const categoryName = examsCategories.filter((cat) => cat.id === categoryId);

    if (categoryName === undefined) {
      <Alert severity="error">An error occurred</Alert>;
    }

    return categoryName[0].name;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (error_message) {
    return <Alert severity="error">{error_message}</Alert>;
  }

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {!session ? (
        <IconButton
          sx={{
            position: "absolute",
            bottom: "1%",
            right: "1%",
            cursor: "pointer",
          }}
          color="primary"
          aria-label="sign in"
          component="span"
          onClick={() => signIn()}
        >
          <LoginIcon />
        </IconButton>
      ) : (
        <IconButton
          sx={{
            position: "absolute",
            bottom: "1%",
            right: "1%",
            cursor: "pointer",
          }}
          color="primary"
          aria-label="sign in"
          component="span"
          onClick={() => signOut()}
        >
          <AdminPanelSettingsIcon />
        </IconButton>
      )}

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical list of examsCategories"
          sx={{ borderRight: 1, borderColor: "divider", minWidth: "6em" }}
        >
          {examsCategories.map((exam, index) => {
            return (
              <Tab
                sx={{ fontSize: "1.2em" }}
                key={exam.id}
                label={exam.name}
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>
        {examsCategories.map((examCat, index) => {
          let currentExams = exams.filter(
            (exam) => exam.examsCategoriesId === examCat.id
          );

          return (
            <TabPanel key={examCat.id} value={value} index={index}>
              {currentExams.map((exam, examIndex) => {
                return (
                  <Accordion key={examIndex}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${examIndex}-content`}
                      id={`panel${examIndex}-header`}
                    >
                      <Typography>
                        {getExamCategory(exam.examsCategoriesId)} - {exam.date}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <Link
                          href={`/exam/${getExamCategory(
                            exam.examsCategoriesId
                          )}/${exam.date}`}
                          passHref
                        >
                          <Button
                            variant="contained"
                            color="success"
                            endIcon={<QuizIcon />}
                          >
                            TEST
                          </Button>
                        </Link>
                        <Button
                          variant="contained"
                          color="warning"
                          endIcon={<EditIcon />}
                          disabled
                        >
                          Arkusz - teoria
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          endIcon={<HandymanIcon />}
                          disabled
                        >
                          Arkusz - praktyka
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<KeyIcon />}
                          disabled
                        >
                          Klucz odpowiedzi - teoria
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<KeyIcon />}
                          disabled
                        >
                          Klucz odpowiedzi - praktyka
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </TabPanel>
          );
        })}
      </Box>
    </div>
  );
}
