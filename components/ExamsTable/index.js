import {
  IconButton,
  Input,
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

export default function ExamsTable({ data }) {
  const [edit, setEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const headers = ["LP", "ID", "Nazwa", "Data"];

  const onEditClick = (e, itemId) => {
    setEdit(true);
    setEditItem(itemId);
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
          {data.map((exam, index) => (
            <TableRow
              key={exam.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{exam.id}</TableCell>
              {edit && editItem === exam.id ? (
                <TableCell>
                  <Input defaultValue={exam.examCategory.name} />
                </TableCell>
              ) : (
                <TableCell>{exam.examCategory.name}</TableCell>
              )}
              {edit && editItem === exam.id ? (
                <TableCell>
                  <Input defaultValue={exam.date} />
                </TableCell>
              ) : (
                <TableCell>{exam.date}</TableCell>
              )}
              <TableCell>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {edit && editItem === exam.id ? null : (
                    <>
                      <IconButton color="error" variant="contained">
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        onClick={(e) => onEditClick(e, exam.id)}
                        variant="contained"
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                  {edit && editItem === exam.id && (
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
