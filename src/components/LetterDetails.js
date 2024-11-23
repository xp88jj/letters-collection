import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import "../App.css";

const LetterDetails = () => {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const possiblePaths = [`letters/${id}`, `letters/letter${id}`];
    let found = false;

    const fetchLetter = async () => {
      for (const path of possiblePaths) {
        const letterRef = ref(database, path);
        const snapshot = await get(letterRef);
        if (snapshot.exists()) {
          setLetter(snapshot.val());
          found = true;
          break;
        }
      }
      if (!found) {
        setLetter(null);
      }
    };

    fetchLetter();
  }, [id]);

  const downloadAsJSON = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(letter, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `letter_${id}.json`;
    downloadAnchor.click();
  };

  const downloadAsCSV = () => {
    // Define the desired order of fields
    const orderedKeys = [
      "id",
      "date",
      "sender",
      "receiver",
      "type",
      "location",
      "access",
      "notes",
      "fileLink",
    ];
  
    // Create the header row based on the desired order
    const headers = orderedKeys.join(",");
  
    // Create the data row based on the desired order
    const values = orderedKeys
      .map((key) => (letter[key] !== undefined ? `"${letter[key]}"` : '""'))
      .join(",");
  
    // Combine the header and values into the CSV content
    const csvContent = `${headers}\n${values}`;
  
    // Generate the download link
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
