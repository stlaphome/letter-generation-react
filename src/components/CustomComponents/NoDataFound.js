import { Box } from "@mui/material";
import query from "../../images/query.png";

const NoDataFound = (props) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          className="noDataImage"
          id="layout-menu-image"
          src={query}
          alt="No Data"
          style={props.imageStyle}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h3>{props.message}</h3>
      </Box>
    </Box>
  );
};

export default NoDataFound;
