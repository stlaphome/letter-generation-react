import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import store, { persistor } from "./components/Store/index";
import axios from "axios";

import { PersistGate } from "redux-persist/integration/react";

axios.defaults.baseURL = process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

reportWebVitals();
