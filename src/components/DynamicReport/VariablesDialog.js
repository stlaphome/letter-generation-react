import React from "react";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import { Button, ListItemButton, ListItemIcon, Tooltip } from "@mui/material";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "./VariablesDialog.css";
import CustomButton from "../CustomComponents/CustomButton";

const VariablesDialog = (props) => {
  const [openShortcut, setOpenShortcut] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);

  const openVariablesDialog = (event) => {
    setOpenShortcut(!openShortcut);
    setAnchorElement(anchorElement ? null : event.currentTarget);
  };
  return (
    <>
      <Tooltip title="Variables">
        <IconButton
          onClick={openVariablesDialog}
          disabled={props.variablesList.length === 0}
        >
          <HelpOutlineIcon sx={{ color: "blue" }} fontSize="large" />
        </IconButton>
      </Tooltip>

      <Popper id="shortcut-popups" open={openShortcut} anchorEl={anchorElement}>
        <Box
          sx={{
            p: 2,
            border: "2px solid #000",
            backgroundColor: "white",
            width: "400px",
            height: "400px",
            overflow: "scroll",
          }}
        >
          <h4>
            <u>{"Variables:"}</u>
            <CustomButton
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "black",
                height: "2rem",
                fontWeight: "bold",
                float: "right",
              }}
              onMouseOver={({ target }) => {
                target.style.backgroundColor = "black";
                target.style.color = "white";
              }}
              onClick={openVariablesDialog}
            >
              Close
            </CustomButton>
          </h4>
          <Grid spacing={1}>
            {props.variablesList.map((rows, index) => {
              return (
                <Grid item>
                  {index + 1}
                  {"."}
                  {rows}{" "}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Popper>
    </>
  );
};
export default VariablesDialog;
