// src/utils/utils.js

const generateLetters = () => {
  const letters = {};

  // Predefined lists of realistic sender and receiver names
  const senderNames = [
    "Alice Johnson",
    "Bob Smith",
    "Charlotte Brown",
    "David Williams",
    "Ella Davis",
    "Frank Wilson",
    "Grace Miller",
    "Henry Moore",
    "Isabella Taylor",
    "James Anderson",
    "Karen Thomas",
    "Liam Lee",
    "Mia Harris",
    "Noah Martin",
    "Olivia White",
    "Paul Thompson",
    "Quinn Garcia",
    "Ryan Martinez",
    "Sophia Clark",
    "Thomas Lewis",
  ];

  const receiverNames = [
    "Victoria King",
    "William Scott",
    "Xavier Hall",
    "Yasmine Lopez",
    "Zachary Hill",
    "Amelia Perez",
    "Benjamin Walker",
    "Chloe Adams",
    "Daniel Baker",
    "Emma Carter",
    "Fiona Rivera",
    "George Phillips",
    "Hannah Stewart",
    "Ian Sanchez",
    "Julia Reed",
    "Kyle Butler",
    "Luna Collins",
    "Matthew Bell",
    "Natalie Mitchell",
    "Owen Parker",
  ];

  for (let i = 1; i <= 100; i++) {
    letters[`letter${i}`] = {
      id: `${i}`,
      date: `19${80 + Math.floor(Math.random() * 20)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}`,
      sender: senderNames[Math.floor(Math.random() * senderNames.length)],
      receiver: receiverNames[Math.floor(Math.random() * receiverNames.length)],
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
