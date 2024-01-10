import {
  ExpandLess,
  ExpandMore,
  LogoutTwoTone,
  MarkEmailReadTwoTone,
  NoteAddTwoTone,
  VisibilityTwoTone,
} from "@mui/icons-material";

import MenuIcon from "@mui/icons-material/Menu";
import {
  Backdrop,
  CircularProgress,
  Collapse,
  Divider,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { default as React, useEffect, useLayoutEffect, useState } from "react";

import CryptoJS from "crypto-js";

import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";
import PageNotFound from "../CustomComponents/PageNotFound";
import TextEditor from "../DynamicReport/TextEditor";
import TriggerView from "../DynamicReport/TriggerView";
import HandShake from "../CustomComponents/HandShake";

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Pagelayout() {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openLetterGenerationSubMenu, setOpenLetterGenerationSubMenu] =
    useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const deviceModeValue = useMediaQuery("(max-width:1200px)");

  var encodedUserId = btoa("UserId");
  var encodedMobileNumber = btoa("MobileNumber");
  var encodedActiveSessionTabId = btoa("activeSessionTabId");
  var encodedDashboardRedirect = btoa("DASHBOARDREDIRECT");
  const [startPoll, setStartPoll] = useState(false);
  const [initialPollAfterLoad, setInitialPollAfterLoad] = useState(true);
  const [latestSessionData, setLatestSessionData] = useState({});
  const [userName, setUserName] = useState("");
  let newAxiosBase = { ...axios };
  newAxiosBase.defaults.baseURL =
    process.env.REACT_APP_NON_LMS_COMMON_LOGIN_BACKEND_SERVER;

  let paramValues = useParams();

  const handleDrawerOpen = (event) => {
    setExpanded(true);
  };

  const handleDrawerClose = (event) => {
    setExpanded(false);
  };

  const handleLetterGenerationSubMenu = () => {
    setOpenLetterGenerationSubMenu(!openLetterGenerationSubMenu);
  };

  const menuClickHandler = (event) => {
    setExpanded(false);
    routeBasedOnKey(event.currentTarget.id);
  };

  const getUrlParamValues = () => {
    let userIdValue = undefined;
    let mobileNumberValue = undefined;
    let activeSessionTabId = undefined;
    const pageUrlParamValue = { ...paramValues }["*"];
    if (String(window.location.pathname).includes("letterGenerationCreate")) {
      let paramValue = pageUrlParamValue.split("letterGenerationCreate/")[1];
      paramValue = String(window.location.pathname).includes(
        btoa("DASHBOARDREDIRECT")
      )
        ? paramValue.split(btoa("DASHBOARDREDIRECT") + "/")[1]
        : paramValue;
      const loginType = paramValue.split("/")[0];
      const sessionValue = paramValue.split("/")[1];
      const activeSessionTabIdValue = sessionValue?.split(
        encodedActiveSessionTabId
      )[1];
      activeSessionTabId = activeSessionTabIdValue
        ? atob(activeSessionTabIdValue)
        : undefined;
      userIdValue = loginType?.split(encodedUserId)[1];
      mobileNumberValue = loginType?.split(encodedMobileNumber)[1];
    } else {
      // it was consider by default as a letterGenerationTrigger page.
      let paramValue = pageUrlParamValue.split("letterGenerationTrigger/")[1];
      paramValue = String(window.location.pathname).includes(
        btoa("DASHBOARDREDIRECT")
      )
        ? paramValue.split(btoa("DASHBOARDREDIRECT") + "/")[1]
        : paramValue;
      const loginType = paramValue.split("/")[0];
      const sessionValue = paramValue.split("/")[1];
      const activeSessionTabIdValue = sessionValue?.split(
        encodedActiveSessionTabId
      )[1];
      activeSessionTabId = activeSessionTabIdValue
        ? atob(activeSessionTabIdValue)
        : undefined;
      userIdValue = loginType?.split(encodedUserId)[1];
      mobileNumberValue = loginType?.split(encodedMobileNumber)[1];
    }
    return {
      [encodedUserId]: userIdValue,
      [encodedMobileNumber]: mobileNumberValue,
      [encodedActiveSessionTabId]: btoa(activeSessionTabId),
    };
  };

  useEffect(() => {
    const urlParamValues = getUrlParamValues();
    const userIdValue = urlParamValues[encodedUserId];
    const mobileNumberValue = urlParamValues[encodedMobileNumber];
    const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];
    const uiPollCountDown = setInterval(() => {
      "use strict";
      const pollValue = new Boolean(startPoll);
      const initialPollAfterLoadValue = new Boolean(initialPollAfterLoad);
      if (pollValue) {
        const sessionDataString = localStorage.getItem(
          userIdValue ? String(userIdValue) : String(mobileNumberValue)
        );
        const sessionData = sessionDataString
          ? JSON.parse(sessionDataString)
          : sessionDataString;
        const currentTabConfigDt = sessionData?.encodedConfigDtKey;
        const currentTabrandomKeyDt = sessionData?.encodedRandomKey;
        const currentTabActiveSessionId =
          sessionData?.encodedActiveSessionTabId;
        if (
          String(window.location.pathname).includes(btoa("DASHBOARDREDIRECT"))
        ) {
          if (
            !initialPollAfterLoadValue &&
            currentTabConfigDt === null &&
            currentTabrandomKeyDt === null &&
            currentTabActiveSessionId === null
          ) {
            // when null means other tab was logged out or reloaded.

            clearInterval(uiPollCountDown);
            localStorage.removeItem(
              userIdValue ? String(userIdValue) : String(mobileNumberValue)
            );
            // false means -> it was not a manual trigger this indicates the backend data should not delete & ui alone should route
            // since if i clear db new session also will logout.

            handleLogout(false);
          }
        } else {
          if (
            currentTabConfigDt === null &&
            currentTabrandomKeyDt === null &&
            currentTabActiveSessionId === null
          ) {
            // when null means other tab was logged out or reloaded.

            clearInterval(uiPollCountDown);
            localStorage.removeItem(
              userIdValue ? String(userIdValue) : String(mobileNumberValue)
            );
            // false means -> it was not a manual trigger this indicates the backend data should not delete & ui alone should route
            // since if i clear db new session also will logout.

            handleLogout(false);
          }
        }
        setInitialPollAfterLoad(false);
      }
    }, 3000);
    return () => {
      clearInterval(uiPollCountDown);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("unload", () => tabCloseLogout());
    return () => {
      // on page destroy remove the session.
      window.removeEventListener("unload", () => tabCloseLogout());
    };
  }, [latestSessionData]);

  useEffect(() => {
    // for every 5 sec poll the backend & check for keys if keys mismatch then logout & redirect to login.
    const urlParamValues = getUrlParamValues();
    const userIdValue = urlParamValues[encodedUserId];
    const mobileNumberValue = urlParamValues[encodedMobileNumber];
    const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];

    let userSessionData;
    const countDown = setInterval(async () => {
      "use strict";
      let newAxiosBase = { ...axios };
      newAxiosBase.defaults.baseURL =
        process.env.REACT_APP_NON_LMS_COMMON_LOGIN_BACKEND_SERVER;
      const sessionDataString = localStorage.getItem(
        userIdValue ? String(userIdValue) : String(mobileNumberValue)
      );
      const sessionData = sessionDataString
        ? JSON.parse(sessionDataString)
        : sessionDataString;
      const currentTabConfigDt = sessionData?.encodedConfigDtKey;
      const currentTabrandomKeyDt = sessionData?.encodedRandomKey;
      const pollValue = new Boolean(startPoll);
      if (pollValue) {
        if (userIdValue) {
          // get from internal login.

          const response = await newAxiosBase.post(
            "nonlmscommonlogin/pollInternalUserLoginData",
            {
              userId: atob(userIdValue),
              subProduct: "LETTER_GENERATION",
            }
          );
          userSessionData = response.data;
          if (
            !String(window.location.pathname).includes(
              btoa("DASHBOARDREDIRECT")
            )
          ) {
            setLatestSessionData(userSessionData);
          }
        } else {
          // mobile number value.
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/pollExternalUserLoginData",
            {
              mobileNumber: atob(String(mobileNumberValue)),
              subProduct: "LETTER_GENERATION",
            }
          );
          userSessionData = response.data;
          if (
            !String(window.location.pathname).includes(
              btoa("DASHBOARDREDIRECT")
            )
          ) {
            setLatestSessionData(userSessionData);
          }
        }

        if (
          String(window.location.pathname).includes(btoa("DASHBOARDREDIRECT"))
        ) {
          // for dashboard access type poll the dashboard data also & compare the dashboard session id with letter generation id.
          let dashboardSessionData;

          if (userIdValue) {
            // get from internal login.

            const commonDashboardResponse = await newAxiosBase.post(
              "nonlmscommonlogin/pollInternalUserLoginData",
              {
                userId: atob(userIdValue),
                subProduct: "COMMON_DASHBOARD",
              }
            );

            dashboardSessionData = commonDashboardResponse.data;
            setInitialPollAfterLoad(false);

            if (
              userSessionData.configDt &&
              userSessionData.randomKey &&
              !(
                JSON.stringify(dashboardSessionData.configDt) ===
                  JSON.stringify(userSessionData.configDt) &&
                JSON.stringify(dashboardSessionData.randomKey) ===
                  JSON.stringify(userSessionData.randomKey) &&
                JSON.stringify(dashboardSessionData.sessionActiveTabId) ===
                  JSON.stringify(userSessionData.sessionActiveTabId)
              )
            ) {
              // when not equal route to login page.
              clearInterval(countDown);
              localStorage.removeItem(
                userIdValue ? String(userIdValue) : String(mobileNumberValue)
              );

              handleLogout(false);
            }
          } else {
            // mobile number value.
            const commonDashboardResponse = await newAxiosBase.post(
              "nonlmscommonlogin/pollExternalUserLoginData",
              {
                mobileNumber: atob(String(mobileNumberValue)),
                subProduct: "COMMON_DASHBOARD",
              }
            );
            dashboardSessionData = commonDashboardResponse.data;
            setInitialPollAfterLoad(false);

            if (
              userSessionData.configDt &&
              userSessionData.randomKey &&
              !(
                JSON.stringify(dashboardSessionData.configDt) ===
                  JSON.stringify(userSessionData.configDt) &&
                JSON.stringify(dashboardSessionData.randomKey) ===
                  JSON.stringify(userSessionData.randomKey) &&
                JSON.stringify(dashboardSessionData.sessionActiveTabId) ===
                  JSON.stringify(userSessionData.sessionActiveTabId)
              )
            ) {
              // when not equal route to login page.
              clearInterval(countDown);
              localStorage.removeItem(
                userIdValue ? String(userIdValue) : String(mobileNumberValue)
              );

              handleLogout(false);
            }
          }
        } else {
          // normal polling & comparison for direct url access.
          setInitialPollAfterLoad(false);
          if (
            !(
              JSON.stringify(currentTabConfigDt) ===
                JSON.stringify(userSessionData.configDt) &&
              JSON.stringify(currentTabrandomKeyDt) ===
                JSON.stringify(userSessionData.randomKey) &&
              JSON.stringify(atob(String(activeSessionTabId))) ===
                JSON.stringify(userSessionData.sessionActiveTabId)
            )
          ) {
            // when not equal route to login page.
            clearInterval(countDown);
            localStorage.removeItem(
              userIdValue ? String(userIdValue) : String(mobileNumberValue)
            );

            handleLogout(false);
          }
        }
      }
    }, 5000);
    return () => {
      clearInterval(countDown);
    };
  }, []);

  useEffect(() => {
    const compareSessionKeys = async () => {
      // get the login page url if required to redirect.
      let loginUrl = "";
      const response = await newAxiosBase.post(
        "nonlmscommonlogin/getSubProductDataByCode",
        {
          subProductCode: ["COMMON_LOGIN_UI"],
        }
      );
      if (response.status === 200) {
        const subProductDetails = response.data;
        loginUrl = subProductDetails[0]?.subProductCodeUrl;
        loginUrl =
          loginUrl + "/" + btoa("subProductId") + btoa("LETTER_GENERATION");
      } else if (response.status === 206) {
        console.log("Login URl Details Not Found or Inactive");
      }
      // compare the keys.
      // 1. first get session id from the url & check on db.

      const urlParamValues = getUrlParamValues();
      const userIdValue = urlParamValues[encodedUserId];
      const mobileNumberValue = urlParamValues[encodedMobileNumber];
      const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];

      // dashboard page
      let userSessionData;

      if (
        String(window.location.pathname).includes(btoa("DASHBOARDREDIRECT"))
      ) {
        // when data is parsed properly & the url contains the dashboard redirect.
        // then insert this new session for subproduct to the db.
        // now store the data to backend table.

        // poll the dashboard date once for key comparision.
        let dashboardSessionData;
        if (userIdValue) {
          // get from internal login.

          const response = await newAxiosBase.post(
            "nonlmscommonlogin/pollInternalUserLoginData",
            {
              userId: atob(userIdValue),
              subProduct: "COMMON_DASHBOARD",
            }
          );
          dashboardSessionData = response.data;
        } else {
          // mobile number value.
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/pollExternalUserLoginData",
            {
              mobileNumber: atob(String(mobileNumberValue)),
              subProduct: "COMMON_DASHBOARD",
            }
          );
          dashboardSessionData = response.data;
        }

        if (
          atob(atob(String(activeSessionTabId))) ===
          dashboardSessionData.sessionActiveTabId
        ) {
          const saveResponse = await axios.post(
            "nonlmscommonlogin/storeInternalUserLoginData",
            {
              userId: userIdValue ? userIdValue : mobileNumberValue,
              randomKey: dashboardSessionData.randomKey,
              configDt: dashboardSessionData.configDt,
              sessionActiveTabId: btoa(dashboardSessionData.sessionActiveTabId),
              subProduct: "LETTER_GENERATION",
              sessionAccessType: "DASHBOARD_ACCESS",
              createdOn: new Date(),
            }
          );

          if (saveResponse.status === 200) {
            try {
              JSON.parse(
                CryptoJS.AES.decrypt(
                  atob(dashboardSessionData.configDt),
                  atob(dashboardSessionData.randomKey)
                ).toString(CryptoJS.enc.Utf8)
              );

              let sessionData = {
                encodedConfigDtKey: dashboardSessionData.configDt,
                encodedRandomKey: dashboardSessionData.randomKey,
                encodedActiveSessionTabId: btoa(
                  dashboardSessionData.sessionActiveTabId
                ),
              };

              localStorage.setItem(userIdValue, JSON.stringify(sessionData));
              setTimeout(() => {
                setLoading(false);
                setStartPoll(true);
              }, 3000);
            } catch (error) {
              console.log(error);

              setTimeout(() => {
                window.open(loginUrl, "_self");
              }, 5000);
            }
          } else {
            // for when dashbaord access type ->  sub product was not able to insert then handle auto logout of subproduct.
            handleLogout(false);
          }
        } else {
          setTimeout(() => {
            window.open(loginUrl, "_self");
          }, 5000);
        }
      } else {
        // considered as direct url access for letter generation
        if (userIdValue) {
          // get from internal login.
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getInternalUserLoginData",
            {
              userId: atob(userIdValue),
              subProduct: "LETTER_GENERATION",
            }
          );
          userSessionData = response.data;

          if (
            atob(String(activeSessionTabId)) ===
            userSessionData.sessionActiveTabId
          ) {
            try {
              JSON.parse(
                CryptoJS.AES.decrypt(
                  atob(userSessionData.configDt),
                  atob(userSessionData.randomKey)
                ).toString(CryptoJS.enc.Utf8)
              );

              let sessionData = {
                encodedConfigDtKey: userSessionData.configDt,
                encodedRandomKey: userSessionData.randomKey,
                encodedActiveSessionTabId: btoa(
                  userSessionData.sessionActiveTabId
                ),
              };

              localStorage.setItem(userIdValue, JSON.stringify(sessionData));
              setTimeout(() => {
                setLoading(false);
                setStartPoll(true);
              }, 3000);
            } catch (error) {
              console.log(error);
              setTimeout(() => {
                window.open(loginUrl, "_self");
              }, 5000);
            }
          } else {
            setTimeout(() => {
              window.open(loginUrl, "_self");
            }, 5000);
          }
        } else {
          // get from external login details.
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getExternalUserLoginData",
            {
              mobileNumber: atob(String(mobileNumberValue)),
              subProduct: "LETTER_GENERATION",
            }
          );
          userSessionData = response.data;
          if (
            atob(String(activeSessionTabId)) ===
            userSessionData.sessionActiveTabId
          ) {
            try {
              JSON.parse(
                CryptoJS.AES.decrypt(
                  atob(userSessionData.configDt),
                  atob(userSessionData.randomKey)
                ).toString(CryptoJS.enc.Utf8)
              );

              let sessionData = {
                encodedConfigDtKey: userSessionData.configDt,
                encodedRandomKey: userSessionData.randomKey,
                encodedActiveSessionTabId: btoa(
                  userSessionData.sessionActiveTabId
                ),
              };

              localStorage.setItem(
                String(mobileNumberValue),
                JSON.stringify(sessionData)
              );

              setTimeout(() => {
                setLoading(false);
                setStartPoll(true);
              }, 3000);
            } catch (error) {
              setTimeout(() => {
                window.open(loginUrl, "_self");
              }, 5000);
            }
          } else {
            setTimeout(() => {
              window.open(loginUrl, "_self");
            }, 5000);
          }
        }
      }
    };
    compareSessionKeys();
  }, []);

  useEffect(() => {
    const urlParamValues = getUrlParamValues();
    const userIdValue = urlParamValues[encodedUserId];
    const mobileNumberValue = urlParamValues[encodedMobileNumber];
    const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];

    if (userIdValue) {
      setUserName(atob(userIdValue));
    } else {
      setUserName(atob(String(mobileNumberValue)));
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const handleLogout = async (manualtrigger) => {
    if (manualtrigger) {
      const urlParamValues = getUrlParamValues();
      const userIdValue = urlParamValues[encodedUserId];
      const mobileNumberValue = urlParamValues[encodedMobileNumber];
      const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];

      if (userIdValue) {
        const response = await newAxiosBase.post(
          "nonlmscommonlogin/storeInternalUserLoginData",
          {
            userId: userIdValue,
            randomKey: null,
            configDt: null,
            sessionActiveTabId: null,
            subProduct: "LETTER_GENERATION",
            sessionAccessType: null,
          }
        );

        if (response.status === 200) {
          let loginUrl = "";
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getSubProductDataByCode",
            {
              subProductCode: ["COMMON_LOGIN_UI"],
            }
          );
          if (response.status === 200) {
            const subProductDetails = response.data;
            loginUrl = subProductDetails[0]?.subProductCodeUrl;
            loginUrl =
              loginUrl + "/" + btoa("subProductId") + btoa("LETTER_GENERATION");
          }
          window.open(loginUrl, "_self");
        }
      } else if (mobileNumberValue) {
        const response = await newAxiosBase.post(
          "nonlmscommonlogin/storeExternalUserLoginData",
          {
            mobileNumber: mobileNumberValue,
            randomKey: null,
            configDt: null,
            sessionActiveTabId: null,
            subProduct: "LETTER_GENERATION",
            sessionAccessType: null,
          }
        );

        if (response.status === 200) {
          let loginUrl = "";
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getSubProductDataByCode",
            {
              subProductCode: ["COMMON_LOGIN_UI"],
            }
          );
          if (response.status === 200) {
            const subProductDetails = response.data;
            loginUrl = subProductDetails[0]?.subProductCodeUrl;
            loginUrl =
              loginUrl + "/" + btoa("subProductId") + btoa("LETTER_GENERATION");
          }
          window.open(loginUrl, "_self");
        }
      }
    } else {
      let loginUrl = "";
      const response = await newAxiosBase.post(
        "nonlmscommonlogin/getSubProductDataByCode",
        {
          subProductCode: ["COMMON_LOGIN_UI"],
        }
      );
      if (response.status === 200) {
        const subProductDetails = response.data;
        loginUrl = subProductDetails[0]?.subProductCodeUrl;
        loginUrl =
          loginUrl + "/" + btoa("subProductId") + btoa("LETTER_GENERATION");
      }
      window.open(loginUrl, "_self");
    }
  };

  const tabCloseLogout = async () => {
    const urlParamValues = getUrlParamValues();
    const userIdValue = urlParamValues[encodedUserId];
    const mobileNumberValue = urlParamValues[encodedMobileNumber];
    const activeSessionTabId = urlParamValues[encodedActiveSessionTabId];

    // tab close event can be triggered for the manual tab close or auto logout also when a new session started also.
    // get from internal login.
    const userSessionData = { ...latestSessionData };
    if (atob(activeSessionTabId) === userSessionData.sessionActiveTabId) {
      // it was consider as the normal & manual tab close.
      if (userIdValue) {
        const response = await newAxiosBase.post(
          "nonlmscommonlogin/updateInternalUserSessionDeadLock",
          {
            userId: userIdValue,
            subProduct: "LETTER_GENERATION",
            sessionDeadLock: true,
          }
        );

        if (response.status === 200) {
          let loginUrl = "";
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getSubProductDataByCode",
            {
              subProductCode: ["COMMON_LOGIN_UI"],
            }
          );
          if (response.status === 200) {
            const subProductDetails = response.data;
            loginUrl = subProductDetails[0]?.subProductCodeUrl;
            loginUrl =
              loginUrl + "/" + btoa("subProductId") + btoa("COMMON_DASHBOARD");
          }
          window.open(loginUrl, "_self");
        }
      } else if (mobileNumberValue) {
        const response = await newAxiosBase.post(
          "nonlmscommonlogin/updateExternalUserSessionDeadLock",
          {
            mobileNumber: mobileNumberValue,
            subProduct: "LETTER_GENERATION",
            sessionDeadLock: true,
          }
        );

        if (response.status === 200) {
          let loginUrl = "";
          const response = await newAxiosBase.post(
            "nonlmscommonlogin/getSubProductDataByCode",
            {
              subProductCode: ["COMMON_LOGIN_UI"],
            }
          );
          if (response.status === 200) {
            const subProductDetails = response.data;
            loginUrl = subProductDetails[0]?.subProductCodeUrl;
            loginUrl =
              loginUrl + "/" + btoa("subProductId") + btoa("COMMON_DASHBOARD");
          }
          window.open(loginUrl, "_self");
        }
      }
    }
  };

  const routeBasedOnKey = (key) => {
    var path = "";
    switch (key) {
      case "letterGeneration":
        path = "/lettergeneration/home/letterGenerationCreate";
        break;
      case "letterGenerationTrigger":
        path = "/lettergeneration/home/letterGenerationTrigger";
        break;

      default:
        path = "/lettergeneration/home/letterGenerationCreate";
        break;
    }

    // append the current active user & session id for navigate on side menu click change.
    // if(){

    // }
    // "/" +
    //   encodedUserId +
    //   btoa(employeeID) +
    //   "/" +
    //   activeSessionTabId +
    //   btoa(userSessionData.sessionActiveTabId);
    navigate(path, { replace: true });
  };

  const list = (
    <Box
      sx={{
        width: 300,
        display: "block",
        height: "100%",
        backgroundColor: "#169BD5",
        color: "white",
      }}
      role="presentation"
    >
      <List
        sx={{ width: 300, backgroundColor: "#169BD5" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton
          id="letterGenerate"
          onClick={handleLetterGenerationSubMenu}
        >
          <ListItemIcon>
            <Tooltip title="Letter Generation" disableHoverListener={!expanded}>
              <MarkEmailReadTwoTone fontSize="medium" sx={{ color: "white" }} />
            </Tooltip>
          </ListItemIcon>
          <ListItemText
            id="menu-lable"
            primary="Letter Generation"
            sx={{ display: "block" }}
          />
          {openLetterGenerationSubMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openLetterGenerationSubMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              id="letterGeneration"
              onClick={menuClickHandler}
            >
              <ListItemIcon>
                {/* <img id='layout-menu-image' src={Insurance} /> */}
                <Tooltip
                  title="Create / Modify"
                  disableHoverListener={!expanded}
                >
                  <NoteAddTwoTone fontSize="medium" sx={{ color: "white" }} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                id="menu-lable"
                sx={{ display: "block" }}
                primary="Create / Modify"
              />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              id="letterGenerationTrigger"
              onClick={menuClickHandler}
            >
              <ListItemIcon>
                <Tooltip
                  title="View / Trigger"
                  disableHoverListener={!expanded}
                >
                  <VisibilityTwoTone
                    fontSize="medium"
                    sx={{ color: "white" }}
                  />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                id="menu-lable"
                sx={{ display: "block" }}
                primary="View / Trigger"
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <div id="drawer-closer" onClick={handleDrawerClose}></div>
    </Box>
  );

  const logOutBtn = (
    <>
      <Stack direction="row" sx={{ width: "100%", justifyContent: "flex-end" }}>
        <Stack direction="row" sx={{ padding: "8px" }}>
          <Typography
            sx={{ textAlign: "right", color: "white", fontSize: "1.5rem" }}
          >
            {userName}
          </Typography>
        </Stack>
        <Divider
          sx={{
            borderWidth: "2px",
            backgroundColor: "#fff",
            height: "50px",
            marginTop: "5px",
          }}
          orientation="vertical"
          flexItem
        />
        <Stack direction="row" sx={{ alignItems: "center", marginLeft: "8px" }}>
          <Stack
            direction="column"
            sx={{ alignItems: "center", marginRight: "8px" }}
          ></Stack>
          <Tooltip title="Logout">
            <IconButton onClick={() => handleLogout(true)}>
              <LogoutTwoTone sx={{ color: "white" }} fontSize="large" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );

  return (
    <Box sx={{ width: "100%", marginTop: "70px", padding: "8px 0px 0px 8px" }}>
      <div
        className="anchor"
        onClick={handleDrawerOpen}
        height="100%"
        width="4px"
        backgroundColor="black"
      ></div>
      <CssBaseline />
      {!loading && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#004A92",
            height: "70px",
            justifyContent: "center",
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            {logOutBtn}
          </Toolbar>
        </AppBar>
      )}
      {!loading && (
        <div>
          <Drawer
            anchor="left"
            id="drawer-menu"
            open={expanded}
            onClose={handleDrawerClose}
            sx={{ zIndex: "1301 !important" }}
          >
            {list}
          </Drawer>
        </div>
      )}
      <Box
        sx={{ width: "100%", marginTop: "10px", padding: "8px 0px 0px 8px" }}
      >
        {loading ? (
          <>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={true}
            >
              {deviceModeValue && <CircularProgress color="inherit" />}
              {!deviceModeValue && <HandShake />}
            </Backdrop>
          </>
        ) : (
          <>
            <Routes>
              <Route
                exact
                path={`letterGenerationCreate/${encodedDashboardRedirect}:${encodedDashboardRedirect}/${encodedUserId}:${encodedUserId}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TextEditor />}
              />
              <Route
                exact
                path={`letterGenerationCreate/${encodedUserId}:${encodedUserId}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TextEditor />}
              />
              <Route
                exact
                path={`letterGenerationCreate/${encodedDashboardRedirect}:${encodedDashboardRedirect}/${encodedMobileNumber}:${encodedMobileNumber}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TextEditor />}
              />
              <Route
                exact
                path={`letterGenerationCreate/${encodedMobileNumber}:${encodedMobileNumber}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TextEditor />}
              />

              <Route
                exact
                path={`letterGenerationTrigger/${encodedDashboardRedirect}:${encodedDashboardRedirect}/${encodedUserId}:${encodedUserId}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TriggerView />}
              />
              <Route
                exact
                path={`letterGenerationTrigger/${encodedUserId}:${encodedUserId}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TriggerView />}
              />

              <Route
                exact
                path={`letterGenerationTrigger/${encodedDashboardRedirect}:${encodedDashboardRedirect}/${encodedMobileNumber}:${encodedMobileNumber}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TriggerView />}
              />
              <Route
                exact
                path={`letterGenerationTrigger/${encodedMobileNumber}:${encodedMobileNumber}/${encodedActiveSessionTabId}:${encodedActiveSessionTabId}`}
                element={<TriggerView />}
              />
              <Route path="*" exact element={<PageNotFound />} />
            </Routes>
          </>
        )}
      </Box>
    </Box>
  );
}
export default Pagelayout;
