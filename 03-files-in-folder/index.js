const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
fsPromises
  .readdir(path.join(__dirname, "secret-folder"), { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(file.parentPath, file.name);
        fs.stat(filePath, (err, stats) => {
          const extname = path.extname(filePath);
          console.log(`${path.basename(filePath, extname)}--${extname.slice(1)}--${stats.size}b`);
        })
      }
    });
  });
