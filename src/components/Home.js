import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  return (
    <div className="container">
      <h1 className="heading">Welcome to the Letter Collection</h1>
      <p className="description">
        Discover and explore a curated archive of letters. Navigate through the collection, search for specific letters, or filter by various categories. Every letter tells a unique story that connects people, events, and history.
      </p>
      
      <div className="btn-center">
        <Link to="/letters" className="btn">
          View the Collection
        </Link>
        <Link to="/statistics" className="btn" style={{ marginTop: "10px" }}>
          View Statistics
        </Link>
        <Link to="/admin" className="btn" style={{ marginTop: "10px" }}>
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Home;
