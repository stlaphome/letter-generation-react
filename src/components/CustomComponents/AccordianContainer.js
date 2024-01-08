import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { useState } from "react";

const AccordianContainer = (props) => {
  const [openAccordian, setOpenAccordian] = useState(props.initialOpen);

  const state = props.setAccordianOpen
    ? props.setAccordianOpen(openAccordian)
    : null;

  return (
    <Accordion
      id={props.id}
      expanded={openAccordian}
      sx={props.sx ? props.sx : { width: "100%", marginTop: "8px !important" }}
      onChange={() => {
        setOpenAccordian(!openAccordian);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ width: "100%", margin: "unset", minHeight: "48px !important" }}
      >
        <Typography>
          <h4>{props.title}</h4>
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: "100%",
          margin: "unset",
          paddingTop: "8px",
          padding: "4px 16px 4px 16px",
        }}
      >
        {props.children}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordianContainer;
