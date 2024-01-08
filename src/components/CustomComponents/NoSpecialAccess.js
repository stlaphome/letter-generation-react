import React from "react";
import { Box } from "@mui/material";
import Error401 from "../../images/401_error.jpg";
const NoSpecialAccess = () => {
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={Error401} width="60%" height="40%" />
      </Box>

      <div id="info">
        <h3 style={{ textAlign: "center", margin: 0, padding: 0 }}>
          <>
            The Special Access is not given to this user. Please make it and try
            again.
          </>
        </h3>
      </div>
    </React.Fragment>
  );
};
export default NoSpecialAccess;
