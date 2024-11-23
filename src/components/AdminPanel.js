import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, onValue, push, update, remove } from "firebase/database";
import "../App.css";

const AdminPanel = () => {
  const [letters, setLetters] = useState([]);
  const [currentLetter, setCurrentLetter] = useState({
    id: "",
    date: "",
    sender: "",
    receiver: "",
    type: "",
    location: "",
    fileLink: "",
    notes: "",
    access: "Public",
  });
  const [isEditing, setIsEditing] = useState(false);

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
      } else {
        setLetters([]);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (isEditing) {
      // Ensure update targets the existing record
      if (!currentLetter.id) {
        console.error("Editing mode but no ID provided!");
        return;
      }
  
      const letterRef = ref(database, `letters/${currentLetter.id}`);
      update(letterRef, { ...currentLetter })
        .then(() => console.log(`Letter with ID ${currentLetter.id} updated successfully`))
        .catch((error) => console.error("Error updating letter:", error));
    } else {
      // Add a new letter
      const newLetterRef = push(ref(database, "letters"));
      const newLetterKey = newLetterRef.key; // Get auto-generated key
      update(newLetterRef, { ...currentLetter, id: newLetterKey })
        .then(() => console.log("New letter added successfully"))
        .catch((error) => console.error("Error adding letter:", error));
    }
  
    // Reset the form
    setCurrentLetter({
      id: "",
      date: "",
      sender: "",
      receiver: "",
      type: "",
      location: "",
      fileLink: "",
      notes: "",
      access: "Public",
    });
    setIsEditing(false);
  };

  const handleEdit = (letter) => {
    setCurrentLetter(letter);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const letterRef = ref(database, `letters/letter${id}`);
    remove(letterRef)
      .then(() => {
        console.log(`Letter with ID ${id} deleted successfully`);
        setLetters((prevLetters) => prevLetters.filter((letter) => letter.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting letter:", error);
      });
  };

  return (
    <div className="container">
      {/* Back to Home Button */}
      <div className="btn-container">
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>

      <h1 className="heading">Admin Panel</h1>

      {/* Add/Edit Form */}
      <div className="admin-form">
        <h2>{isEditing ? "Edit Letter" : "Add New Letter"}</h2>
        <label>ID (Leave empty for auto-generated ID):</label>
        <input
          type="text"
          name="id"
          value={currentLetter.id}
          onChange={handleInputChange}
          disabled={isEditing} // Prevent editing ID when editing an existing letter
        />
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={currentLetter.date}
          onChange={handleInputChange}
        />
        <label>Sender:</label>
        <input
          type="text"
          name="sender"
          value={currentLetter.sender}
          onChange={handleInputChange}
        />
        <label>Receiver:</label>
        <input
          type="text"
          name="receiver"
          value={currentLetter.receiver}
          onChange={handleInputChange}
        />
        <label>Type:</label>
        <input
          type="text"
          name="type"
          value={currentLetter.type}
          onChange={handleInputChange}
        />
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={currentLetter.location}
          onChange={handleInputChange}
        />
        <label>File Link:</label>
        <input
          type="text"
          name="fileLink"
          value={currentLetter.fileLink}
          onChange={handleInputChange}
        />
        <label>Notes:</label>
        <textarea
          name="notes"
          value={currentLetter.notes}
          onChange={handleInputChange}
        />
        <label>Access:</label>
        <select
          name="access"
          value={currentLetter.access}
          onChange={handleInputChange}
        >
          <option value="Public">Public</option>
          <option value="Restricted">Restricted</option>
        </select>
        <button className="btn" onClick={handleAddOrUpdate}>
          {isEditing ? "Update Letter" : "Add Letter"}
        </button>
      </div>

      {/* Manage Letters Section */}
      <div className="manage-letters">
        <h2>Manage Letters</h2>
        <ul className="letter-list">
          {letters.map((letter) => (
            <li key={letter.id} className="letter-item">
              <strong>{letter.date}</strong>: {letter.sender} to{" "}
              {letter.receiver}
              <br />
              <em>{letter.notes}</em>
              <div>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(letter)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(letter.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
