import "./App.css";

import { Route, Routes } from "react-router-dom";

import PageNotFound from "./components/CustomComponents/PageNotFound";
import Pagelayout from "./components/Pagelayout/Pagelayout";
import TextEditor from "./components/DynamicReport/TextEditor";
import TriggerView from "./components/DynamicReport/TriggerView";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path={`/lettergeneration/home/*`} element={<Pagelayout />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path={`stlap/lettergeneration/letterGenerationCreate`} element={<TextEditor />} />
          <Route path={`stlap/lettergeneration/letterGenerationTrigger`} element={<TriggerView />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
