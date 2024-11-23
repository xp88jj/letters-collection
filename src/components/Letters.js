import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "../App.css";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedLetters, setPaginatedLetters] = useState([]);
  const itemsPerPage = 10;

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
        paginate(lettersArray); // Initial pagination
      } else {
        setLetters([]);
        setPaginatedLetters([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const paginate = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, index) => {
      const start = index * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    });
    setPaginatedLetters(pages);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const applyFilters = useCallback(() => {
    let results = letters;

    if (searchTerm) {
      results = results.filter(
        (letter) =>
          letter.sender.toLowerCase().includes(searchTerm) ||
          letter.receiver.toLowerCase().includes(searchTerm) ||
          letter.notes.toLowerCase().includes(searchTerm)
      );
    }

    if (filterByAccess !== "All") {
      results = results.filter(
        (letter) => letter.access.toLowerCase() === filterByAccess.toLowerCase()
      );
    }

    if (filterByType !== "All") {
      results = results.filter(
        (letter) => letter.type.toLowerCase() === filterByType.toLowerCase()
      );
    }

    if (startDate) {
      results = results.filter((letter) => new Date(letter.date) >= new Date(startDate));
    }
    if (endDate) {
      results = results.filter((letter) => new Date(letter.date) <= new Date(endDate));
    }

    if (filterByLocation !== "All") {
      results = results.filter(
        (letter) => letter.location.toLowerCase() === filterByLocation.toLowerCase()
      );
    }

    paginate(results); // Recalculate pagination after filtering
  }, [letters, searchTerm, filterByAccess, filterByType, startDate, endDate, filterByLocation]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="container">
      <h1 className="heading">Letters</h1>

      {/* Filters */}
      <div className="filters-container">
        <div>
          <input
            type="text"
            placeholder="Search by sender, receiver, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filters-group">
          <select onChange={(e) => setFilterByAccess(e.target.value)} value={filterByAccess} className="form-select">
            <option value="All">All Access Levels</option>
            <option value="Public">Public</option>
            <option value="Restricted">Restricted</option>
          </select>

          <select onChange={(e) => setFilterByType(e.target.value)} value={filterByType} className="form-select">
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
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <select onChange={(e) => setFilterByLocation(e.target.value)} value={filterByLocation} className="form-select">
            <option value="All">All Locations</option>
            <option value="Library XYZ">Library XYZ</option>
            <option value="Family Archive">Family Archive</option>
            <option value="Private Collection">Private Collection</option>
            <option value="Digital Archive">Digital Archive</option>
          </select>
        </div>
      </div>

      {/* Letter List */}
      <ul className="letter-list">
        {paginatedLetters[currentPage]?.map((letter) => (
          <li key={letter.id} className="letter-item">
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>Notes: {letter.notes}</em>
            <br />
            <Link to={`/letters/${letter.id}`} className="btn-link">
              View Details
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        {paginatedLetters.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`btn ${currentPage === index ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Letters;
