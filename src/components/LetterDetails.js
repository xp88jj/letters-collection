import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Component to display details of a single letter
 *
 * @param {string} id The ID of the letter to display
 * @returns {JSX.Element} JSX element displaying the letter details
 */
/******  65936698-d589-4afd-9f61-72ca04db5472  *******/const LetterDetails = () => {
  const { id } = useParams(); // Get the letter ID from the URL
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    console.log("URL Parameter (id):", id); // Debug: Check the id from the URL

    // Use the correct key format: 'letter' + id
    const letterRef = ref(database, `letters/letter${id}`);
    console.log("Firebase Path:", `letters/letter${id}`); // Debug: Check the Firebase path

    // Fetch the data from Firebase
    onValue(letterRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched Letter Data from Firebase:", data); // Debug: Check fetched data
      setLetter(data || null); // Set data or null if not found
    });
  }, [id]);

  if (!letter) {
    console.log("No data found or still loading for ID:", id); // Debug: No data or still loading
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
