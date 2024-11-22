import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "../App.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const lettersRef = ref(database, "letters");
    const unsubscribe = onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.values(data);

        // Calculate statistics
        const totalLetters = lettersArray.length;
        const lettersByDecade = {};
        const senders = {};
        const receivers = {};
        const types = {};

        lettersArray.forEach((letter) => {
          const { date, sender, receiver, type } = letter;

          // Letters by Decade
          const year = parseInt(date.substring(0, 4), 10);
          if (!isNaN(year)) {
            const decade = `${Math.floor(year / 10) * 10}s`;
            lettersByDecade[decade] = (lettersByDecade[decade] || 0) + 1;
          }

          // Most Common Senders
          if (sender) senders[sender] = (senders[sender] || 0) + 1;

          // Most Common Receivers
          if (receiver) receivers[receiver] = (receivers[receiver] || 0) + 1;

          // Letters by Type
          if (type) types[type] = (types[type] || 0) + 1;
        });

        // Sort and limit to top 3 for senders and receivers
        const mostCommonSenders = Object.entries(senders)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([sender, count]) => `${sender}: ${count}`);

        const mostCommonReceivers = Object.entries(receivers)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([receiver, count]) => `${receiver}: ${count}`);

        // Save to state
        setStatistics({
          totalLetters,
          lettersByDecade,
          mostCommonSenders,
          mostCommonReceivers,
          types,
        });
      } else {
        setStatistics(null);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (statistics === null) {
    return <p>Loading statistics...</p>;
  }

  return (
    <div className="container">
      {/* Back to Home Button */}
      <div className="btn-container">
        <Link to="/" className="btn">
          Back to Home Page
        </Link>
      </div>

      <h1 className="heading">Collection Statistics</h1>
      <div className="statistics-overview">
        <p><strong>Total Letters:</strong> {statistics.totalLetters}</p>

        <h2>Letters by Decade:</h2>
        <ul>
          {Object.entries(statistics.lettersByDecade).map(([decade, count]) => (
            <li key={decade}>{decade}: {count}</li>
          ))}
        </ul>

        <h2>Most Common Senders:</h2>
        <ul>
          {statistics.mostCommonSenders.map((sender, index) => (
            <li key={index}>{sender}</li>
          ))}
        </ul>

        <h2>Most Common Receivers:</h2>
        <ul>
          {statistics.mostCommonReceivers.map((receiver, index) => (
            <li key={index}>{receiver}</li>
          ))}
        </ul>

        <h2>Letters by Type:</h2>
        <ul>
          {Object.entries(statistics.types).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
      </div>

      {/* Go to Visualizations Button */}
      <div className="btn-container">
        <Link to="/visualizations" className="btn">
          Go to Visualizations
        </Link>
      </div>
    </div>
  );
};

export default Statistics;