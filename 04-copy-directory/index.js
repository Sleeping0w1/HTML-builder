const fsPromises = require('fs/promises');
const path = require('path');

const copyFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

async function copyDir(folder, copyFolder) {
  fsPromises.mkdir(copyFolder, { recursive: true }).then(
    fsPromises.readdir(folder).then((files) => {
      files.forEach((file) => {
        fsPromises.copyFile(
          path.join(folder, file),
          path.join(copyFolder, file),
        );
      });
    }),
  );  
}
fsPromises.rm(copyFolderPath, {recursive: true, force: true}).then(() => copyDir(folderPath, copyFolderPath));
