import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home"; // Import the Home component
import Letters from "./components/Letters"; // Import the Letters component
import LetterDetails from "./components/LetterDetails"; // Import the LetterDetails component
import AdminPanel from "./components/AdminPanel"; // Import the AdminPanel component

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the Letters list */}
        <Route path="/letters" element={<Letters />} />

        {/* Route for the Letter Details page */}
        <Route path="/letters/:id" element={<LetterDetails />} />

        {/* Route for the Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
