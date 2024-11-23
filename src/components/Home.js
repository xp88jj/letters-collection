import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px", color: "#333" }}>Welcome to the Letter Collection</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px", color: "#555", lineHeight: "1.6" }}>
        Discover and explore a curated archive of letters spanning decades. Navigate through the
        collection, search for specific letters, or filter by various categories. Every letter tells a
        unique story that connects people, events, and history.
      </p>
      <Link
        to="/letters"
        style={{
          display: "inline-block",
          padding: "15px 30px",
          backgroundColor: "#007BFF",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        View the Collection
      </Link>
    </div>
  );
};

export default Home;
