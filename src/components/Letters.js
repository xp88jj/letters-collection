import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Link } from "react-router-dom";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const lettersRef = ref(database, "letters");

    const unsubscribe = onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.values(data);
        setLetters(lettersArray);
        setFilteredLetters(lettersArray);
      } else {
        setLetters([]);
        setFilteredLetters([]);
      }
    });

    return () => off(lettersRef, "value", unsubscribe);
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

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

      <input
        type="text"
        placeholder="Search by sender, receiver, or notes..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          width: "calc(100% - 20px)",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      />

      <ul>
        {filteredLetters.map((letter) => (
          <li key={letter.id}>
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
            <br />
            <Link to={`/letters/${letter.id}`}>View Details</Link>
          </li>
        ))}
      </ul>

      {filteredLetters.length === 0 && <p>No letters found matching your criteria.</p>}
    </div>
  );
};

export default Letters;
