import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]); // To store filtered results
  const [searchTerm, setSearchTerm] = useState(""); // User's search input

  useEffect(() => {
    const lettersRef = ref(database, "letters");

    const unsubscribe = onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.values(data);
        setLetters(lettersArray);
        setFilteredLetters(lettersArray); // Initially, show all letters
      } else {
        setLetters([]);
        setFilteredLetters([]);
      }
    });

    return () => off(lettersRef, "value", unsubscribe);
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter letters based on sender, receiver, or notes
    const results = letters.filter(
      (letter) =>
        letter.sender.toLowerCase().includes(searchValue) ||
        letter.receiver.toLowerCase().includes(searchValue) ||
        letter.notes.toLowerCase().includes(searchValue)
    );

    setFilteredLetters(results);
  };

  return (
    <div>
      <h1>Letters</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by sender, receiver, or notes..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
      />

      <ul>
        {filteredLetters.map((letter) => (
          <li key={letter.id}>
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
          </li>
        ))}
      </ul>

      {/* No results message */}
      {filteredLetters.length === 0 && <p>No letters found matching your search.</p>}
    </div>
  );
};

export default Letters;
