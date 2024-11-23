import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "../App.css";

const Visualizations = () => {
  const [associates, setAssociates] = useState([]);

  useEffect(() => {
    const lettersRef = ref(database, "letters");
    onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.values(data);
        const associatesMap = {};

        lettersArray.forEach((letter) => {
          const { sender, receiver, date } = letter;

          // Parse date and skip invalid entries
          const parsedDate = parseDate(date);
          if (!parsedDate) return;

          // Update sender
          if (!associatesMap[sender]) {
            associatesMap[sender] = { count: 0, firstDate: parsedDate, lastDate: parsedDate };
          }
          associatesMap[sender].count += 1;
          associatesMap[sender].firstDate = new Date(
            Math.min(associatesMap[sender].firstDate, parsedDate)
          );
          associatesMap[sender].lastDate = new Date(
            Math.max(associatesMap[sender].lastDate, parsedDate)
          );

          // Update receiver
          if (!associatesMap[receiver]) {
            associatesMap[receiver] = { count: 0, firstDate: parsedDate, lastDate: parsedDate };
          }
          associatesMap[receiver].count += 1;
          associatesMap[receiver].firstDate = new Date(
            Math.min(associatesMap[receiver].firstDate, parsedDate)
          );
          associatesMap[receiver].lastDate = new Date(
            Math.max(associatesMap[receiver].lastDate, parsedDate)
          );
        });

        // Convert map to array
        const associatesList = Object.entries(associatesMap).map(
          ([name, { count, firstDate, lastDate }]) => ({
            name,
            count,
            firstDate: firstDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
            lastDate: lastDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
          })
        );

        setAssociates(associatesList);
      }
    });
  }, []);

  return (
    <div className="container">
      {/* Back to Statistics Button */}
      <div className="btn-center" style={{ marginBottom: "20px" }}>
        <Link to="/statistics" className="btn">
          Back to Statistics
        </Link>
      </div>

      <h1 className="heading">Visualizations</h1>
      <table className="table"> {/* Use the correct table class */}
        <thead>
          <tr>
            <th>Associate Name</th>
            <th>Letters Exchanged</th>
            <th>First Letter Date</th>
            <th>Last Letter Date</th>
          </tr>
        </thead>
        <tbody>
          {associates.map((associate, index) => (
            <tr key={index}>
              <td>{associate.name}</td>
              <td>{associate.count}</td>
              <td>{associate.firstDate || "N/A"}</td>
              <td>{associate.lastDate || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Utility function for parsing dates
const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date; // Return null for invalid dates
};

export default Visualizations;
