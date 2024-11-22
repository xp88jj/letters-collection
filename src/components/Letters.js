import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import debounce from "lodash/debounce";
import "../App.css";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedLetters, setPaginatedLetters] = useState([]);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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

  // Debounced search handler using useMemo
  const debouncedUpdateSearchTerm = useMemo(
    () =>
      debounce((term) => {
        setDebouncedSearchTerm(term);
      }, 300), // Adjust delay (e.g., 300ms)
    [] // Empty dependency array ensures memoized debounce is stable
  );

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term); // Update immediately for display
    debouncedUpdateSearchTerm(term); // Debounce actual filtering
  };

  // Filtering logic using useMemo
  const filteredLetters = useMemo(() => {
    let results = letters;

    if (debouncedSearchTerm) {
      results = results.filter(
        (letter) =>
          letter.sender.toLowerCase().includes(debouncedSearchTerm) ||
          letter.receiver.toLowerCase().includes(debouncedSearchTerm) ||
          letter.notes.toLowerCase().includes(debouncedSearchTerm)
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

    return results;
  }, [
    letters,
    debouncedSearchTerm,
    filterByAccess,
    filterByType,
    startDate,
    endDate,
    filterByLocation,
  ]);

  // Recalculate pagination whenever the filtered list changes
  useEffect(() => {
    paginate(filteredLetters);
  }, [filteredLetters]);

  return (
    <div className="container">
      {/* Back to Home Button */}
      <div className="btn-center" style={{ marginBottom: "20px" }}>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>

      <h1 className="heading">Letters</h1>

      {/* Filters */}
      <div className="filters-container">
        <div>
          <input
            type="text"
            placeholder="Search by sender, receiver, or notes..."
            value={searchTerm}
            onChange={handleSearchChange}
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
