import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageNotFoundImage from "../../images/pageNotFound.png";
import axios from "axios";

const PageNotFound = () => {
  const [loginUrl, setLoginUrl] = useState("");
  useEffect(() => {
    const getLoginUrl = async () => {
      const response = await axios.post(
        "nonlmscommonlogin/getSubProductDataByCode",
        {
          subProductCode: ["COMMON_LOGIN_UI"],
        }
      );
      if (response.status === 200) {
        const subProductDetails = response.data;
        let url = subProductDetails[0]?.subProductCodeUrl;
        url = url + "/" + btoa("subProductId") + btoa("ADDRESS_MASTER");
        setLoginUrl(url);
      }
    };
    // getLoginUrl();
  }, []);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={PageNotFoundImage} width="60%" height="40%" />
      </Box>

      <div id="info">
        <h3 style={{ textAlign: "center", margin: 0, padding: 0 }}>
          <>
            <span>We Looked everywhere for this Page.</span>
            <br></br>
            {loginUrl !== "" && (
              <span>
                {" "}
                Are you Sure the Website URL is correct ?{" "}
                <a id="myLink" href={loginUrl}>
                  <span>Click me for Navigation to login page.</span>
                </a>
              </span>
            )}
          </>
        </h3>
      </div>
    </React.Fragment>
  );
};

export default PageNotFound;
