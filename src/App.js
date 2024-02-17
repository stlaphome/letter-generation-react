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
          <Route path={`/lettergeneration/stlap/letterGenerationCreate`} element={<TextEditor stlap={true}/>} />
          <Route path={`/lettergeneration/stlap/letterGenerationTrigger`} element={<TriggerView stlap={true}/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
