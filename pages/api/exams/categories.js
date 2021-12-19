import { examsCategories } from "../../../models";

const getAllCategories = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const examCategories = await examsCategories.findMany();

        res.status(200).json({ categories: examCategories });
      } catch (e) {
        res.status(422).json({ categories: null, error: e });
        console.log(e);
      }
      break;

    default:
      break;
  }
};

export default getAllCategories;
