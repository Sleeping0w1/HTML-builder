const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const readLine = require('readline');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readline = readLine.createInterface({ input: stdin, output: stdout });

readline.on('line', (str) => {
  if(str === 'exit') process.exit(0);
  file.write(str);
});
readline.on('error', (err) => readline.write(err.message));
process.on('exit', (code) => console.log(`Process to exit with code ${code}`));
