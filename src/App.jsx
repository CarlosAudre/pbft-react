import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ReplicasPanel from "./components/pages/ReplicasPanel";
import VotePanel from "./components/pages/VotePanel";
import ResultPanel from "./components/pages/ResultPanel";
import HomePage from "./components/pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
