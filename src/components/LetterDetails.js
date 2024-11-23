import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "../App.css"; // Import the CSS file for consistent styles

const LetterDetails = () => {
  const { id } = useParams(); // Get the letter ID from the URL
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const letterRef = ref(database, `letters/letter${id}`);
    const unsubscribe = onValue(letterRef, (snapshot) => {
      setLetter(snapshot.val() || null);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [id]);

  // Export letter details as JSON
  const downloadAsJSON = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(letter, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `letter_${id}.json`;
    downloadAnchor.click();
  };

  // Export letter details as CSV
  const downloadAsCSV = () => {
    const csvContent = [
      ["Field", "Value"],
      ...Object.entries(letter).map(([key, value]) => [key, value]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const dataStr = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `letter_${id}.csv`;
    downloadAnchor.click();
  };

  if (!letter) {
    return (
      <div className="no-results">
        <p>Loading letter details or no data found for ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading">Letter Details</h1>

      <div className="letter-details">
        <p>
          <strong>Date:</strong> {letter.date}
        </p>
        <p>
          <strong>Sender:</strong> {letter.sender}
        </p>
        <p>
          <strong>Receiver:</strong> {letter.receiver}
        </p>
        <p>
          <strong>Type:</strong> {letter.type}
        </p>
        <p>
          <strong>Location:</strong> {letter.location}
        </p>
        <p>
          <strong>Notes:</strong> {letter.notes}
        </p>
        <p>
          <strong>Access:</strong> {letter.access}
        </p>
        {letter.fileLink && (
          <p>
            <strong>File Link:</strong>{" "}
            <a
              href={letter.fileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link"
            >
              Open File
            </a>
          </p>
        )}
      </div>

      <div className="btn-center">
        <button onClick={downloadAsJSON} className="btn">
          Download as JSON
        </button>
        <button onClick={downloadAsCSV} className="btn">
          Download as CSV
        </button>
        <Link to="/letters" className="btn">
          Back to Letters
        </Link>
      </div>
    </div>
  );
};

export default LetterDetails;
