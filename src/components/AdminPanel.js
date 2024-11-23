import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, set, push, onValue, remove } from "firebase/database";
import "../App.css"; // Ensure consistent styles

const AdminPanel = () => {
  const [letters, setLetters] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    sender: "",
    receiver: "",
    type: "",
    location: "",
    fileLink: "",
    notes: "",
    access: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch letters from Firebase
  useEffect(() => {
    const lettersRef = ref(database, "letters");
    onValue(lettersRef, (snapshot) => {
      setLetters(snapshot.val() || {});
    });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or Update a letter
  const handleSubmit = (e) => {
    e.preventDefault();

    const letterRef = editMode
      ? ref(database, `letters/letter${formData.id}`)
      : push(ref(database, "letters"));

    set(letterRef, formData).then(() => {
      alert(editMode ? "Letter updated successfully!" : "Letter added successfully!");
      setFormData({
        id: "",
        date: "",
        sender: "",
        receiver: "",
        type: "",
        location: "",
        fileLink: "",
        notes: "",
        access: "",
      });
      setEditMode(false);
    });
  };

  // Edit a letter
  const handleEdit = (id) => {
    const letter = letters[`letter${id}`];
    setFormData({ ...letter, id });
    setEditMode(true);
  };

  // Delete a letter
  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete letter ${id}?`)) {
      remove(ref(database, `letters/letter${id}`)).then(() => {
        alert("Letter deleted successfully!");
      });
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Admin Panel</h1>

      {/* Form to Add/Edit Metadata */}
      <form onSubmit={handleSubmit} className="admin-form">
        <label>ID (Leave empty for auto-generated ID):</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="e.g., 1"
          disabled={editMode}
        />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Sender:</label>
        <input
          type="text"
          name="sender"
          value={formData.sender}
          onChange={handleChange}
          required
        />

        <label>Receiver:</label>
        <input
          type="text"
          name="receiver"
          value={formData.receiver}
          onChange={handleChange}
          required
        />

        <label>Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Scanned PDF">Scanned PDF</option>
          <option value="Original">Original</option>
          <option value="Typed Transcript">Typed Transcript</option>
          <option value="Photocopy">Photocopy</option>
          <option value="Email Transcript">Email Transcript</option>
        </select>

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>File Link:</label>
        <input
          type="url"
          name="fileLink"
          value={formData.fileLink}
          onChange={handleChange}
        />

        <label>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>

        <label>Access:</label>
        <select
          name="access"
          value={formData.access}
          onChange={handleChange}
          required
        >
          <option value="">Select Access</option>
          <option value="Public">Public</option>
          <option value="Restricted">Restricted</option>
        </select>

        <button type="submit" className="btn">
          {editMode ? "Update Letter" : "Add Letter"}
        </button>
      </form>

      {/* List of Letters */}
      <h2 className="heading">Manage Letters</h2>
      <ul className="letter-list">
        {Object.entries(letters).map(([key, letter]) => (
          <li key={key} className="letter-item">
            <strong>{letter.date}</strong>: {letter.sender} to {letter.receiver}
            <br />
            <em>{letter.notes}</em>
            <br />
            <button onClick={() => handleEdit(letter.id)} className="btn">
              Edit
            </button>
            <button
              onClick={() => handleDelete(letter.id)}
              className="btn"
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
