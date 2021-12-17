import { exams as Exams, examsCategories } from "../../../models";

const getAllExams = async (req, res) => {
  const examCategoryReq = req.query.name;

  switch (req.method) {
    case "GET":
      try {
        const examCategory = await examsCategories.findUnique({
          where: {
            name: examCategoryReq,
          },
        });

        if (examCategory === null) {
          res.status(404).json({ error: "This category do not exist." });
        }

        const exams = await Exams.findMany({
          where: {
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
      break;
  }
};

export default getAllExams;
