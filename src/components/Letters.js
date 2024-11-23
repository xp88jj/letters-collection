import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]); // To store filtered results
  const [searchTerm, setSearchTerm] = useState(""); // User's search input
  const [filterByAccess, setFilterByAccess] = useState("All"); // Current access filter

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
    applyFilters(searchValue, filterByAccess);
  };

  // Handle dropdown filter
  const handleFilterByAccess = (event) => {
    const selectedAccess = event.target.value;
    setFilterByAccess(selectedAccess);
    applyFilters(searchTerm, selectedAccess);
  };

  // Apply both search and filter logic
  const applyFilters = (searchValue, selectedAccess) => {
    let results = letters;

    // Filter by search term
    if (searchValue) {
      results = results.filter(
        (letter) =>
          letter.sender.toLowerCase().includes(searchValue) ||
          letter.receiver.toLowerCase().includes(searchValue) ||
          letter.notes.toLowerCase().includes(searchValue)
      );
    }

    // Filter by access level
    if (selectedAccess !== "All") {
      results = results.filter(
        (letter) => letter.access.toLowerCase() === selectedAccess.toLowerCase()
      );
    }

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

      {/* Filter Dropdown */}
      <select
        onChange={handleFilterByAccess}
        value={filterByAccess}
        style={{
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          width: "100%",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      >
        <option value="All">All Access Levels</option>
        <option value="Public">Public</option>
        <option value="Restricted">Restricted</option>
      </select>

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
      {filteredLetters.length === 0 && <p>No letters found matching your criteria.</p>}
    </div>
  );
};

export default Letters;
