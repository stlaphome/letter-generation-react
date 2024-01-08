import React from "react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageNotFoundImage from "../../images/pageNotFound.png";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PageNotFoundReducerAction } from "../Store/PageNotFound/PageNotFoundReducer";
import store from "../Store";
import { BranchAction } from "../Store/Branch";
import Cookies from "js-cookie";

const PageNotFound = () => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // let timeleft = 10;
  // let downloadTimer;

  // useEffect(() => {
  //   dispatch(PageNotFoundReducerAction.updateActivationState(true));
  //   if (store.getState().pageNotFound.activationState) {
  //     downloadTimer = setInterval(function () {
  //       if (timeleft <= 0) {
  //         clearInterval(downloadTimer);
  //         document.getElementById("countdown").innerHTML =
  //           "   Redirecting .....";
  //         // setTimeout(() => {
  //         //   dispatch(BranchAction.updateLoginStatus(false));
  //         //   dispatch(BranchAction.updateBranch([]));
  //         //   dispatch(BranchAction.updateUserName(""));
  //         //   dispatch(BranchAction.resetHeaderValues());
  //         //   navigate("/stlap/login", { replace: true });
  //         //   Cookies.remove("Token");
  //         // }, 3000);
  //       } else {
  //         if (document.getElementById("countdown")) {
  //           document.getElementById("countdown").innerHTML =
  //             timeleft + "  seconds remaining ......";
  //         }
  //       }
  //       timeleft -= 1;
  //     }, 1000);
  //   }
  //   return () => {
  //     dispatch(PageNotFoundReducerAction.updateActivationState(false));
  //     clearInterval(downloadTimer);
  //   };
  // }, []);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={PageNotFoundImage} width="60%" height="40%" />
      </Box>

      <div id="info">
        <h3 style={{ textAlign: "center", margin: 0, padding: 0 }}>
          {window.location.pathname === "/stlap/login" ? (
            <>
              You are already logged in can't navigate to login page with out
              Logout.
              <br></br>
              Use side menu for Navigation.
              {/* <span>{"  "}</span>
              <span id="countdown"></span> */}
            </>
          ) : (
            <>
              <span>We Looked everywhere for this Page.</span>
              <br></br>
              <span>
                {" "}
                Are you Sure the Website URL is correct ? Use side menu for
                Navigation.
              </span>

              {/* so i will be redirecting you to
              Login page
              <span>{"  "}</span>
              <span id="countdown"></span> */}
            </>
          )}
        </h3>
      </div>
    </React.Fragment>
  );
};

export default PageNotFound;
