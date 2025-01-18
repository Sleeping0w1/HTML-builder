const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const stylesArr = [];
const file = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
const stylesPath = path.join(__dirname, 'styles');

let filesPromises;
fsPromises
  .readdir(stylesPath)
  .then((files) => {
    filesPromises = files
      .filter((file) => path.extname(path.join(stylesPath, file)) === '.css')
      .map((file) =>
        fsPromises
          .readFile(path.join(stylesPath, file), 'utf-8')
          .then((style) => stylesArr.push(style)),
      );
  })
  .then(() => {
    Promise.all(filesPromises).then(() => file.write(stylesArr.join('\n')));
  });
