// src/utils/utils.js

const generateLetters = () => {
  const letters = {};

  for (let i = 1; i <= 100; i++) {
    letters[`letter${i}`] = {
      id: `${i}`,
      date: `19${80 + Math.floor(Math.random() * 20)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}`,
      sender: `Sender${i}`,
      receiver: `Receiver${i}`,
      type: [
        "Scanned PDF",
        "Original",
        "Typed Transcript",
        "Photocopy",
        "Email Transcript",
      ][Math.floor(Math.random() * 5)],
      location: [
        "Library XYZ",
        "Family Archive",
        "Private Collection",
        "Digital Archive",
      ][Math.floor(Math.random() * 4)],
      fileLink: i % 2 === 0 ? `https://example.com/letter${i}.pdf` : "",
      notes: `This is a generated note for letter ${i}.`,
      access: i % 2 === 0 ? "Public" : "Restricted",
    };
  }

  return { letters }; // Wrap the letters object inside a "letters" key
};

module.exports = { generateLetters };
