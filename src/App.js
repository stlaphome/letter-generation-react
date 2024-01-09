import "./App.css";

import { Route, Routes } from "react-router-dom";

import Pagelayout from "./components/Dashboard/Pagelayout";
import PageNotFound from "./components/CustomComponents/PageNotFound";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path={`/lettergeneration/home/*`} element={<Pagelayout />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
