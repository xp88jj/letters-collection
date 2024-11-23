import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import "../App.css"; // Import the CSS file

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
    <div className="container">
      <h1 className="heading">Letters</h1>

      <div className="filters-container">
        <div>
          <input
            type="text"
            placeholder="Search by sender, receiver, or notes..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-input"
          />
        </div>

        <div className="filters-group">
          <select onChange={handleFilterByAccess} value={filterByAccess} className="form-select">
            <option value="All">All Access Levels</option>
            <option value="Public">Public</option>
            <option value="Restricted">Restricted</option>
          </select>

          <select onChange={handleFilterByType} value={filterByType} className="form-select">
            <option value="All">All Types</option>
            <option value="Scanned PDF">Scanned PDF</option>
            <option value="Original">Original</option>
            <option value="Typed Transcript">Typed Transcript</option>
            <option value="Photocopy">Photocopy</option>
            <option value="Email Transcript">Email Transcript</option>
          </select>
        </div>

        <div className="filters-group">
          <div>
            <label>Start Date:</label>
            <input type="date" onChange={handleStartDateChange} className="form-input" />
          </div>
          <div>
            <label>End Date:</label>
            <input type="date" onChange={handleEndDateChange} className="form-input" />
          </div>
        </div>

        <div>
          <select onChange={handleFilterByLocation} value={filterByLocation} className="form-select">
            <option value="All">All Locations</option>
            <option value="Library XYZ">Library XYZ</option>
            <option value="Family Archive">Family Archive</option>
            <option value="Private Collection">Private Collection</option>
            <option value="Digital Archive">Digital Archive</option>
          </select>
        </div>
      </div>

      <ul className="letter-list">
        {filteredLetters.map((letter) => (
          <li key={letter.id} className="letter-item">
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
            <br />
            <Link to={`/letters/${letter.id.replace("letter", "")}`} className="btn-link">
              View Details
            </Link>
          </li>
        ))}
      </ul>

      {filteredLetters.length === 0 && <p className="no-results">No letters found matching your criteria.</p>}
    </div>
  );
};

export default Letters;
