import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const SecondaryListItems = ({ exams }) => {
  console.log(exams);
  return (
    <div>
      <ListSubheader inset>Ostatnie egzaminy</ListSubheader>
      {exams.map((exam) => {
        return (
          <ListItem key={exam.id} button>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${exam.examCategory.name} - ${exam.date}`}
            />
          </ListItem>
        );
      })}
    </div>
  );
};
