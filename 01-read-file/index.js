const fs = require("fs");
const path = require("path");

const readableStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
let string = "";
readableStream.on("data", (char) => string += char);
readableStream.on("end", () => console.log(string));
readableStream.on("error", (err) => console.log(`Error: ${err.message}`));