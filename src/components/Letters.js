import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]); // To store filtered results
  const [searchTerm, setSearchTerm] = useState(""); // User's search input
  const [filterByAccess, setFilterByAccess] = useState("All"); // Current access filter
  const [filterByType, setFilterByType] = useState("All"); // Current type filter
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [filterByLocation, setFilterByLocation] = useState("All"); // Current location filter

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

  // Apply all filters
  const applyFilters = (
    searchValue,
    selectedAccess,
    selectedType,
    startDate,
    endDate,
    selectedLocation
  ) => {
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

    // Filter by type
    if (selectedType !== "All") {
      results = results.filter(
        (letter) => letter.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filter by date range
    if (startDate) {
      results = results.filter((letter) => new Date(letter.date) >= new Date(startDate));
    }
    if (endDate) {
      results = results.filter((letter) => new Date(letter.date) <= new Date(endDate));
    }

    // Filter by location
    if (selectedLocation !== "All") {
      results = results.filter(
        (letter) => letter.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    setFilteredLetters(results);
  };

  // Update filters dynamically
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    applyFilters(searchValue, filterByAccess, filterByType, startDate, endDate, filterByLocation);
  };

  const handleFilterByAccess = (event) => {
    const selectedAccess = event.target.value;
    setFilterByAccess(selectedAccess);
    applyFilters(searchTerm, selectedAccess, filterByType, startDate, endDate, filterByLocation);
  };

  const handleFilterByType = (event) => {
    const selectedType = event.target.value;
    setFilterByType(selectedType);
    applyFilters(searchTerm, filterByAccess, selectedType, startDate, endDate, filterByLocation);
  };

  const handleFilterByLocation = (event) => {
    const selectedLocation = event.target.value;
    setFilterByLocation(selectedLocation);
    applyFilters(searchTerm, filterByAccess, filterByType, startDate, endDate, selectedLocation);
  };

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setStartDate(startDate);
    applyFilters(searchTerm, filterByAccess, filterByType, startDate, endDate, filterByLocation);
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setEndDate(endDate);
    applyFilters(searchTerm, filterByAccess, filterByType, startDate, endDate, filterByLocation);
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

      {/* Access Level Filter */}
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

      {/* Type Filter */}
      <select
        onChange={handleFilterByType}
        value={filterByType}
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
        <option value="All">All Types</option>
        <option value="Scanned PDF">Scanned PDF</option>
        <option value="Original">Original</option>
        <option value="Typed Transcript">Typed Transcript</option>
        <option value="Photocopy">Photocopy</option>
        <option value="Email Transcript">Email Transcript</option>
      </select>

      {/* Date Range Filters */}
      <div style={{ marginBottom: "20px" }}>
        <label>Start Date: </label>
        <input
          type="date"
          onChange={handleStartDateChange}
          style={{ marginRight: "10px", padding: "10px" }}
        />
        <label>End Date: </label>
        <input
          type="date"
          onChange={handleEndDateChange}
          style={{ padding: "10px" }}
        />
      </div>

      {/* Location Filter */}
      <select
        onChange={handleFilterByLocation}
        value={filterByLocation}
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
        <option value="All">All Locations</option>
        <option value="Library XYZ">Library XYZ</option>
        <option value="Family Archive">Family Archive</option>
        <option value="Private Collection">Private Collection</option>
        <option value="Digital Archive">Digital Archive</option>
      </select>

      {/* Letter List */}
      <ul>
        {filteredLetters.map((letter) => (
          <li key={letter.id}>
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
          </li>
        ))}
      </ul>

      {/* No Results Message */}
      {filteredLetters.length === 0 && <p>No letters found matching your criteria.</p>}
    </div>
  );
};

export default Letters;
