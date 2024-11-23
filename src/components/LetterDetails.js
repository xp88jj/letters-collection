import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

const LetterDetails = () => {
  const { id } = useParams(); // Get the letter ID from the URL
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const letterRef = ref(database, `letters/letter${id}`); // Firebase path for the letter
    onValue(letterRef, (snapshot) => setLetter(snapshot.val() || null)); // Fetch data or set null if not found
  }, [id]);

  if (!letter) {
    return <p>Loading letter details or no data found for ID: {id}</p>;
  }

  return (
    <div>
      <h1>Letter Details</h1>
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
          <a href={letter.fileLink} target="_blank" rel="noopener noreferrer">
            Open File
          </a>
        </p>
      )}
      <Link to="/letters">Back to Letters</Link>
    </div>
  );
};

export default LetterDetails;
