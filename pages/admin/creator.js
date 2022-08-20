import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  FormLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import ExamsTable from "components/ExamsTable";
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
        Kreator egzaminu
      </Typography>
      <Paper elevation={3}>
        <FormControl component="fieldset">
          <FormLabel component="legend">asdas</FormLabel>
          <FormGroup>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value="2"
              label="Age"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <TextField
              id="exam-name"
              label="Data egzaminu"
              variant="outlined"
            />
          </FormGroup>
          <FormHelperText>asdasd</FormHelperText>
        </FormControl>
      </Paper>
      <ExamsTable data={exams} />
    </DashboardTemplate>
  );
}
