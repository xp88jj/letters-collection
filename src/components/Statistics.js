import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "../App.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const lettersRef = ref(database, "letters");
    onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lettersArray = Object.values(data);

        // Calculate statistics
        const totalLetters = lettersArray.length;
        const lettersByDecade = {};
        const senders = {};
        const types = {};

        lettersArray.forEach((letter) => {
          // Letters by Decade
          const decade = `${Math.floor(parseInt(letter.date.substring(0, 4)) / 10) * 10}s`;
          lettersByDecade[decade] = (lettersByDecade[decade] || 0) + 1;

          // Most Common Senders
          senders[letter.sender] = (senders[letter.sender] || 0) + 1;

          // Letters by Type
          types[letter.type] = (types[letter.type] || 0) + 1;
        });

        const mostCommonSenders = Object.entries(senders)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([sender, count]) => `${sender}: ${count}`);

        // Save to state
        setStatistics({
          totalLetters,
          lettersByDecade,
          mostCommonSenders,
          types,
        });
      }
    });
  }, []);

  if (!statistics) {
    return <p>Loading statistics...</p>;
  }

  return (
    <div className="container">
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
        <h2>Letters by Type:</h2>
        <ul>
          {Object.entries(statistics.types).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Statistics;
