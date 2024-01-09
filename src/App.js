import "./App.css";

import { Route, Routes } from "react-router-dom";

import PageNotFound from "./components/CustomComponents/PageNotFound";
import Pagelayout from "./components/Pagelayout/Pagelayout";

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
