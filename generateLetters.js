const { generateLetters } = require("./src/utils/utils");
const fs = require("fs");

const letters = generateLetters();
console.log("Generated Letters JSON:", letters);

// Save to a file
fs.writeFileSync("letters.json", JSON.stringify(letters, null, 2));
console.log("JSON saved to letters.json");
