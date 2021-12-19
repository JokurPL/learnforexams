import prisma from "models";

const checkAnswers = async (req, res) => {
  // From req:    Example data
  //      - date: 06.2021
  //      - examCategory: EE21

  const dateExamReq = "06.2021";
  const examCategoryReq = "EE21";

  switch (req.method) {
    case "POST":
      try {
        const examCategory = await examsCategories.findUnique({
          where: {
            name: examCategoryReq,
          },
        });
        const exams = await Exams.findFirst({
          where: {
            date: dateExamReq,
            examCategory: examCategory,
          },
        });

        res.status(200).json(exams);
      } catch (e) {
        res.status(422).json({ error: e });
        console.log(e);
      }
      break;

    default:
      res.status(401);
      break;
  }
};

export default exercisesForExamApi;
