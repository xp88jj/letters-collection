import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByAccess, setFilterByAccess] = useState("All");
  const [filterByType, setFilterByType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterByLocation, setFilterByLocation] = useState("All");

  useEffect(() => {
    const lettersRef = ref(database, "letters");

    const unsubscribe = onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setLetters(lettersArray);
        setFilteredLetters(lettersArray);
      } else {
        setLetters([]);
        setFilteredLetters([]);
      }
    });

    return () => off(lettersRef, "value", unsubscribe);
  }, []);

  const applyFilters = (
    searchValue,
    selectedAccess,
    selectedType,
    startDate,
    endDate,
    selectedLocation
  ) => {
    let results = letters;

    if (searchValue) {
      results = results.filter(
        (letter) =>
          letter.sender.toLowerCase().includes(searchValue) ||
          letter.receiver.toLowerCase().includes(searchValue) ||
          letter.notes.toLowerCase().includes(searchValue)
      );
    }

    if (selectedAccess !== "All") {
      results = results.filter(
        (letter) => letter.access.toLowerCase() === selectedAccess.toLowerCase()
      );
    }

    if (selectedType !== "All") {
      results = results.filter(
        (letter) => letter.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (startDate) {
      results = results.filter((letter) => new Date(letter.date) >= new Date(startDate));
    }
    if (endDate) {
      results = results.filter((letter) => new Date(letter.date) <= new Date(endDate));
    }

    if (selectedLocation !== "All") {
      results = results.filter(
        (letter) => letter.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    setFilteredLetters(results);
  };

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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Letters</h1>

      {/* Filters Container */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search by sender, receiver, or notes..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              fontSize: "16px",
              padding: "10px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <select
            onChange={handleFilterByAccess}
            value={filterByAccess}
            style={{
              flex: "1",
              fontSize: "16px",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="All">All Access Levels</option>
            <option value="Public">Public</option>
            <option value="Restricted">Restricted</option>
          </select>

          <select
            onChange={handleFilterByType}
            value={filterByType}
            style={{
              flex: "1",
              fontSize: "16px",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="All">All Types</option>
            <option value="Scanned PDF">Scanned PDF</option>
            <option value="Original">Original</option>
            <option value="Typed Transcript">Typed Transcript</option>
            <option value="Photocopy">Photocopy</option>
            <option value="Email Transcript">Email Transcript</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <div style={{ flex: "1" }}>
            <label>Start Date:</label>
            <input
              type="date"
              onChange={handleStartDateChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </div>
          <div style={{ flex: "1" }}>
            <label>End Date:</label>
            <input
              type="date"
              onChange={handleEndDateChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select
            onChange={handleFilterByLocation}
            value={filterByLocation}
            style={{
              fontSize: "16px",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="All">All Locations</option>
            <option value="Library XYZ">Library XYZ</option>
            <option value="Family Archive">Family Archive</option>
            <option value="Private Collection">Private Collection</option>
            <option value="Digital Archive">Digital Archive</option>
          </select>
        </div>
      </div>

      {/* Filtered Letter List */}
      <ul>
        {filteredLetters.map((letter) => (
          <li key={letter.id}>
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
            <br />
            <Link to={`/letters/${letter.id.replace("letter", "")}`}>View Details</Link>
          </li>
        ))}
      </ul>

      {filteredLetters.length === 0 && <p>No letters found matching your criteria.</p>}
    </div>
  );
};

export default Letters;
