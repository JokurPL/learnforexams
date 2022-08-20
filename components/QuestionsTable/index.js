import {
  IconButton,
  Input,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Paper from "@mui/material/Paper";

export default function QuestionTable({ data, exams }) {
  const [edit, setEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const headers = ["LP", "ID", "Treść", "Zdjęcie", "Egzamin", "Numer"];
  const onEditClick = (e, itemId, defaultExam) => {
    setEdit(true);
    setEditItem(itemId);
    setSelectedExam(defaultExam);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="data table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => {
              return <TableCell key={index}>{header}</TableCell>;
            })}
            <TableCell sx={{ textAlign: "center" }}>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((question, index) => (
            <TableRow
              key={question.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{question.id}</TableCell>
              {edit && editItem === question.id ? (
                <TableCell>
                  <Input
                    defaultValue={question.content}
                    multiline
                    sx={{ width: "100%" }}
                  />
                </TableCell>
              ) : (
                <TableCell>{question.content}</TableCell>
              )}
              {edit && editItem === question.id ? (
                <TableCell>
                  <Input
                    inputProps={{ fontSize: "2px" }}
                    defaultValue={question.img}
                    sx={{ width: "100%" }}
                  />
                </TableCell>
              ) : (
                <TableCell>{question.img}</TableCell>
              )}
              <TableCell>
                {question.exam.examCategory.name} - {question.exam.date}
              </TableCell>
              {edit && editItem === question.id ? (
                <TableCell>
                  <Input defaultValue={question.Exercise[0].number} />
                </TableCell>
              ) : (
                <TableCell>{question.Exercise[0].number}</TableCell>
              )}
              <TableCell>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {edit && editItem === question.id ? null : (
                    <>
                      <IconButton color="error" variant="contained">
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        onClick={(e) =>
                          onEditClick(e, question.id, question.exam.id)
                        }
                        variant="contained"
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                  {edit && editItem === question.id && (
                    <>
                      <IconButton
                        onClick={() => setEdit(false)}
                        color="error"
                        variant="contained"
                      >
                        <CancelIcon />
                      </IconButton>
                      <IconButton color="success" variant="contained">
                        <CheckIcon />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
