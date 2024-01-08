import { Box, Typography } from "@mui/material";
import React from "react";

const StlapFooter = () => {
  const deploymentDate = process.env.REACT_APP_DEPLOYMENT_DATE;
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        textAlign: "center",
        left: "0",
        bottom: "0",
        right: "0",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Typography sx={{ color: "black" }} align="center">
        {" "}
        {`© 2023.Sundaram Home Finance Limited. ${new Date().getFullYear()}.  Last Deployment${deploymentDate}`}
      </Typography>
    </Box>
  );
};
export default StlapFooter;
