import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyIcon from "@mui/icons-material/Key";
import QuizIcon from "@mui/icons-material/Quiz";
import HandymanIcon from "@mui/icons-material/Handyman";
import EditIcon from "@mui/icons-material/Edit";

const exams = [
  {
    id: 0,
    examCategory: "EE21",
    namedate: "06.2021",
  },
  {
    id: 1,
    examCategory: "EE19",
    namedate: "06.2021",
  },
  {
    id: 2,
    examCategory: "E20",
    namedate: "06.2021",
  },
  {
    id: 3,
    examCategory: "E21",
    namedate: "06.2021",
  },
  {
    id: 4,
    examCategory: "EE22",
    namedate: "06.2021",
  },
  {
    id: 5,
    examCategory: "EE22",
    namedate: "06.2020",
  },
];

const examsCategory = [
  {
    id: 0,
    name: "EE21",
    namedate: "06.2021",
  },
  {
    id: 1,
    name: "EE19",
    namedate: "06.2021",
  },
  {
    id: 2,
    name: "E20",
    namedate: "06.2021",
  },
  {
    id: 3,
    name: "E21",
    namedate: "06.2021",
  },
  {
    id: 4,
    name: "EE22",
    namedate: "06.2021",
  },
];

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

export default function Home() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
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
          aria-label="Vertical list of examsCategory"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {examsCategory.map((exam) => {
            return (
              <Tab key={exam.id} label={exam.name} {...a11yProps(exam.id)} />
            );
          })}
        </Tabs>
        {examsCategory.map((examCat) => {
          let currentExams = exams.filter(
            (exam) => exam.examCategory === examCat.name
          );

          return (
            <TabPanel key={examCat.id} value={value} index={examCat.id}>
              {currentExams.map((exam) => {
                return (
                  <Accordion key={exam.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${exam.id}-content`}
                      id={`panel${exam.id}-header`}
                    >
                      <Typography>
                        {exam.examCategory} - {exam.namedate}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          color="success"
                          endIcon={<QuizIcon />}
                        >
                          TEST
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          endIcon={<EditIcon />}
                        >
                          Arkusz - teoria
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          endIcon={<HandymanIcon />}
                        >
                          Arkusz - praktyka
                        </Button>
                        <Button variant="contained" endIcon={<KeyIcon />}>
                          Klucz odpowiedzi - teoria
                        </Button>
                        <Button variant="contained" endIcon={<KeyIcon />}>
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
