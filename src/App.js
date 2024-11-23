import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Letters from "./components/Letters";
import LetterDetails from "./components/LetterDetails";
import Statistics from "./components/Statistics";
import Visualizations from "./components/Visualizations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/letters/:id" element={<LetterDetails />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/visualizations" element={<Visualizations />} />
      </Routes>
    </Router>
  );
}

export default App;
