import Head from "next/head";
import prisma from "models";
import {
  Button,
  Card,
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
import { useEffect, useState } from "react";
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
  const [answers, setAnswers] = useState([]);
  const [showGoodAnswers, setShowGoodAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [whatIsBad, setWhatIsBad] = useState([]);

  const onChangeAnswer = (event, exerciseNumber, answerId, isGood) => {
    console.log(event.currentTarget.value);
    console.log(exerciseNumber);
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
    console.log(whatIsBad);
    return;
  }, [answers, whatIsBad]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const goodAnswer = answers.filter((answer) => answer.isGood === true);
    setShowGoodAnswers(true);
    setScore(goodAnswer.length);
    setWhatIsBad(answers.filter((a) => a.isGood === false));
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2%", marginBottom: "2%" }}>
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
                          value={answer.answer.content}
                          control={<Radio />}
                          label={
                            <Typography
                              color={
                                whatIsBad.filter(
                                  (badAnswer) =>
                                    badAnswer.answerId === answer.id &&
                                    badAnswer.exerciseNumber === exercise.number
                                ).length > 0 && showGoodAnswers
                                  ? "#f44336"
                                  : answer.is_good &&
                                    showGoodAnswers &&
                                    "lightgreen"
                              }
                            >
                              {answer.answer.content}
                            </Typography>
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
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "2em",
            color: (score / answers.length) * 100 > 50 ? "#66bb6a" : "#f44336",
          }}
        >
          Twój wynik to: {score}/{answers.length} -{" "}
          {answers.length > 0 ? (score / answers.length) * 100 : 0}%
        </Typography>
      )}
    </Container>
  );
}
