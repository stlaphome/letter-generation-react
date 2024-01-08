import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import TextEditor from "./components/DynamicReport/TextEditor";
import TriggerView from "./components/DynamicReport/TriggerView";
import Pagelayout from "./components/Dashboard/Pagelayout";
import PageNotFound from "./components/Dashboard/PageNotFound";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
        <Route
              path={`/lettergeneration/home/*`}
              element={<Pagelayout />}
            />
          <Route path="*" element={<PageNotFound />} />
                 </Routes>
      </div>
    </>
  );
}

export default App;
