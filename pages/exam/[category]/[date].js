import Head from "next/head";
import prisma from "models";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
export const getServerSideProps = async ({ req, params }) => {
  const examCategory = params.category;
  const examDate = params.date;

  try {
    const exam = await prisma.exams.findFirst({
      where: {
        date: examDate,
        examCategory: {
          name: examCategory,
        },
      },
    });

    const exercisesFromDB = await prisma.exercise.findMany({
      where: {
        examId: exam.id,
      },
    });

    let exercises = await Promise.all(
      exercisesFromDB.map(async (exercise) => {
        const question = await prisma.questions.findUnique({
          where: {
            id: exercise.questionId,
          },
        });
        const answers = await prisma.answersToExercise.findMany({
          where: {
            exerciseId: exercise.id,
          },
          include: {
            answer: true,
          },
        });

        return {
          number: exercise.number,
          question: question.content,
          question_img: question.img,
          answers,
        };
      })
    );

    // Example Answer Object:
    // {
    //   id: 4,
    //   is_good: false,
    //   answersId: 4,
    //   exerciseId: 1,
    //   answer: { id: 4, content: '12', img: null }
    // }
    // Example Exercise Object:
    // {
    //   number: 2,
    //   question: 'Jaka jest jednostka natężenia prądu?',
    //   question_img: null,
    //   answers: [ [Object], [Object], [Object], [Object] ]
    // }

    return {
      props: {
        examCategory,
        examDate,
        exercises: exercises,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default function Exam({ examCategory, examDate, exercises }) {
  const [goodAnswerStyle, setGoodAnswerStyle] = useState(false);
  const showGoodAnswers = () => {
    setGoodAnswerStyle(!goodAnswerStyle);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2%", marginBottom: "2%" }}>
      <Link href="/" passHref>
        <Fab variant="extended" sx={{ margin: "2%", marginLeft: "0" }}>
          <ArrowBackIosIcon fixed sx={{ mr: 1 }} />
          POWRÓT
        </Fab>
      </Link>
      <Head>
        <title>
          {examCategory} - {examDate} test online
        </title>
      </Head>
      {/* <Button onClick={showGoodAnswers}>Pokaż tylko poprawne odpowiedzi</Button> */}
      <Stack spacing={2}>
        {exercises.map((exercise) => {
          return (
            <Card key={exercise.number} variant="outlined">
              {exercise.question_img ? (
                <CardMedia
                  component="img"
                  height={"100%"}
                  image={exercise.question_img}
                  alt="green iguana"
                />
              ) : (
                <CardMedia
                  component="img"
                  height={"200"}
                  image="https://bigram.pl/wp-content/themes/consultix/images/no-image-found-360x260.png"
                  alt="green iguana"
                />
              )}

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {exercise.number}. <strong>{exercise.question}</strong>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="answers" name="radio-buttons-group">
                    {exercise.answers.map((answer) => {
                      return (
                        <FormControlLabel
                          key={answer.id}
                          value={answer.answer.content}
                          control={<Radio />}
                          label={answer.answer.content}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      <Button
        variant="contained"
        size="large"
        sx={{
          textAlign: "center",
          margin: "1% auto",
          width: "100%",
          fontSize: "1.5em",
        }}
        endIcon={<FactCheckIcon />}
      >
        SPRAWDŹ EGZAMIN
      </Button>
    </Container>
  );
}
