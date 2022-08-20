/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import prisma from "models";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import Image from "next/image";
import { Box } from "@mui/system";
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

    if (exercises.length === 0) {
      return {
        notFound: true,
      };
    }

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
  const successBorderImg = {
    borderColor: "lightgreen",
  };

  const failBorderImg = {
    borderColor: "#f44336",
  };

  const [answers, setAnswers] = useState([]);
  const [showGoodAnswers, setShowGoodAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [whatIsBad, setWhatIsBad] = useState([]);

  const [alert, setAlert] = useState(false);

  const onChangeAnswer = (event, exerciseNumber, answerId, isGood) => {
    const answer = {
      exerciseNumber,
      answerId,
      isGood,
    };

    const oldAnswers = answers.filter(
      (answer) => answer.exerciseNumber !== exerciseNumber
    );

    setAnswers([...oldAnswers, answer]);
  };

  useEffect(() => {
    return;
  }, [answers, whatIsBad]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (answers.length < exercises.length) {
      setAlert(true);
      return;
    }
    const goodAnswer = answers.filter((answer) => answer.isGood === true);
    setShowGoodAnswers(true);
    setScore(goodAnswer.length);
    setWhatIsBad(answers.filter((a) => a.isGood === false));
  };

  const handleClose = () => {
    setAlert(false);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2%", marginBottom: "2%" }}>
      <div>
        <Dialog
          open={alert}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Nie odpowiedziałeś na wszystkie pytania"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Zostało jeszcze {exercises.length - answers.length} pytań bez
              odpowiedzi! Spróbuj nawet strzelić!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Rozumiem
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Link href="/" passHref>
        <Fab variant="extended" sx={{ margin: "2%", marginLeft: "0" }}>
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          POWRÓT
        </Fab>
      </Link>
      <Head>
        <title>
          {examCategory} - {examDate} test online
        </title>
      </Head>
      <Stack spacing={2}>
        {exercises.map((exercise, index) => {
          return (
            <Card key={index} variant="outlined">
              {exercise.question_img ? (
                <CardMedia
                  component="img"
                  height={"100%"}
                  image={exercise.question_img}
                  alt="green iguana"
                />
              ) : null}

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {index + 1}. <strong>{exercise.question}</strong>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="answers" name="radio-buttons-group">
                    {exercise.answers.map((answer) => {
                      return (
                        <FormControlLabel
                          color="success"
                          onChange={(e) =>
                            onChangeAnswer(
                              e,
                              exercise.number,
                              answer.id,
                              answer.is_good
                            )
                          }
                          key={answer.id}
                          value={
                            answer.answer.img
                              ? answer.answer.img
                              : answer.answer.content
                          }
                          control={<Radio />}
                          label={
                            answer.answer.img ? (
                              whatIsBad.filter(
                                (badAnswer) =>
                                  badAnswer.answerId === answer.id &&
                                  badAnswer.exerciseNumber === exercise.number
                              ).length > 0 && showGoodAnswers ? (
                                <img
                                  alt="answer"
                                  border={3}
                                  style={{ borderColor: "#f44336" }}
                                  src={answer.answer.img}
                                />
                              ) : answer.is_good && showGoodAnswers ? (
                                <img
                                  alt="answer"
                                  border={3}
                                  style={{ borderColor: "lightgreen" }}
                                  src={answer.answer.img}
                                />
                              ) : (
                                <img
                                  alt="answer"
                                  border={3}
                                  src={answer.answer.img}
                                />
                              )
                            ) : (
                              <Typography
                                color={
                                  whatIsBad.filter(
                                    (badAnswer) =>
                                      badAnswer.answerId === answer.id &&
                                      badAnswer.exerciseNumber ===
                                        exercise.number
                                  ).length > 0 && showGoodAnswers
                                    ? "#f44336"
                                    : answer.is_good &&
                                      showGoodAnswers &&
                                      "lightgreen"
                                }
                              >
                                {answer.answer.content}
                              </Typography>
                            )
                          }
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
        onClick={onSubmitHandler}
        sx={{
          textAlign: "center",
          margin: "1% auto",
          width: "100%",
          fontSize: "1.5em",
        }}
        endIcon={<FactCheckIcon />}
      >
        SPRAWDŹ ODPOWIEDZI
      </Button>
      {showGoodAnswers && (
        <Alert
          variant="filled"
          severity={(score / answers.length) * 100 > 50 ? "success" : "error"}
          sx={{ mt: "1%" }}
        >
          <Typography>
            Twój wynik: {Math.floor((score / answers.length) * 100)}% ({score}/
            {answers.length})
          </Typography>
        </Alert>
      )}
    </Container>
  );
}
