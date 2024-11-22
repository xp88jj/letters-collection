import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const lettersRef = ref(database, "letters");

    // Attach a real-time listener to fetch data from the "letters" node
    const unsubscribe = onValue(
      lettersRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          // Convert the object data into an array
          const lettersArray = Object.values(data);
          setLetters(lettersArray);
        } else {
          // Set an empty array if no data exists
          setLetters([]);
        }
      },
      (error) => {
        // Handle errors during the onValue subscription
        console.error("Error fetching letters:", error);
        setError("Failed to fetch letters. Please try again later.");
      }
    );

    // Cleanup: Detach the listener when the component unmounts
    return () => off(lettersRef, "value", unsubscribe);
  }, []);

  return (
    <div>
      <h1>Letters</h1>
      {error ? ( // Display error message if an error occurs
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {letters.map((letter) => (
            <li key={letter.id}>
              <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
              <br />
              <em>Notes: {letter.notes}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Letters;
