import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Letter Collection</h1>
      <p>Explore and navigate a curated collection of letters spanning decades.</p>
      <Link to="/letters">
        <button>View Letters</button>
      </Link>
    </div>
  );
};

export default Home;
