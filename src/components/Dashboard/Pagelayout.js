import {
  ExpandLess,
  ExpandMore,
  MarkEmailReadTwoTone,
  NoteAddTwoTone,
  VisibilityTwoTone,
} from "@mui/icons-material";

import MenuIcon from "@mui/icons-material/Menu";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  Collapse,
  Divider,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { default as React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import TextEditor from "../DynamicReport/TextEditor";
import TriggerView from "../DynamicReport/TriggerView";
import PageNotFound from "./PageNotFound";

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

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();

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

  const routeBasedOnKey = (key) => {
    var path = "";
    switch (key) {
      case "letterGeneration":
        path = "/lettergeneration/home/letterGeneration";
        break;
      case "letterGenerationTrigger":
        path = "/lettergeneration/home/letterGenerationTrigger";
        break;

      default:
        path = "/lettergeneration/home/letterGeneration";
        break;
    }

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
        </Toolbar>
      </AppBar>
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
      <Box
        sx={{ width: "100%", marginTop: "10px", padding: "8px 0px 0px 8px" }}
      >
        <>
          <Routes>
            <Route
              path={`${search}/letterGeneration`}
              element={<TextEditor />}
            />
            <Route
              path={`${search}/letterGenerationTrigger`}
              element={<TriggerView />}
            />
            <Route path="*" exact={true} element={<PageNotFound />} />
          </Routes>
        </>
      </Box>
    </Box>
  );
}
export default Pagelayout;
