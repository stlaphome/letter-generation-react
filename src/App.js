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
          <Route path={`/lettergeneration/stlap_redirect/letterGenerationCreate`} element={<TextEditor />} />
          <Route path={`/lettergeneration/stlap_redirect/letterGenerationTrigger`} element={<TriggerView />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
