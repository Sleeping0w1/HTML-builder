// const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const copyFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

fsPromises.mkdir(folderPath, { recursive: true }).then(
  fsPromises.readdir(folderPath).then((files) => {
    files.forEach((file) => {
      fsPromises.copyFile(
        path.join(folderPath, file),
        path.join(copyFolderPath, file),
      );
    });
  }),
);
