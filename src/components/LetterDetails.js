import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

const LetterDetails = () => {
  const { id } = useParams(); // Get the letter ID from the URL
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const letterRef = ref(database, `letters/letter${id}`);
    onValue(letterRef, (snapshot) => setLetter(snapshot.val() || null));
  }, [id]);

  if (!letter) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Loading letter details or no data found for ID: {id}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Letter Details</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          <strong>Date:</strong> {letter.date}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Sender:</strong> {letter.sender}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Receiver:</strong> {letter.receiver}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Type:</strong> {letter.type}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Location:</strong> {letter.location}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Notes:</strong> {letter.notes}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Access:</strong> {letter.access}
        </p>
        {letter.fileLink && (
          <p style={{ marginBottom: "10px" }}>
            <strong>File Link:</strong>{" "}
            <a
              href={letter.fileLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Open File
            </a>
          </p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link
          to="/letters"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          Back to Letters
        </Link>
      </div>
    </div>
  );
};

export default LetterDetails;
