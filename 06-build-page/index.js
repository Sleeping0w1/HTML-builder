const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');

function copyFolder(folderPath, copyFolderPath) {
  fsPromises.mkdir(copyFolderPath, { recursive: true }).then(
    fsPromises.readdir(folderPath, { withFileTypes: true }).then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          fsPromises.copyFile(
            path.join(folderPath, file.name),
            path.join(copyFolderPath, file.name),
          );
        } else {
          copyFolder(
            path.join(folderPath, file.name),
            path.join(copyFolderPath, file.name),
          );
        }
      });
    }),
  );
}

fsPromises.mkdir(projectPath, { recursive: true }).then(() => {
  const indexHtmlFile = fs.createWriteStream(
    path.join(projectPath, 'index.html'),
  );
  let indexHtml = '';
  const stylesPath = path.join(__dirname, 'styles');
  const templatePath = path.join(__dirname, 'template.html');

  // Replaces template tags in the template.html
  let htmlPromises;
  fsPromises
    .readFile(templatePath, 'utf-8')
    .then((file) => {
      indexHtml += file;
      const tags = indexHtml.match(/{{[a-z, A-Z]*}}/g);
      htmlPromises = tags.map((tag) => {
        const tagPath = path.join(
          __dirname,
          'components',
          `${tag.slice(2, tag.length - 2)}.html`,
        );
        return fsPromises.readFile(tagPath, 'utf-8').then((data) => {
          indexHtml = indexHtml.replaceAll(tag, data);
        });
      });
    })
    .then(() => {
      Promise.all(htmlPromises).then(() => indexHtmlFile.write(indexHtml));
    });

  // Compiles styles from the styles
  const stylesArr = [];
  const file = fs.createWriteStream(path.join(projectPath, 'style.css'));
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

  // Copies the assets folder into project-dist/assets
  const copyFolderPath = path.join(projectPath, 'assets');
  const folderPath = path.join(__dirname, 'assets');
  copyFolder(folderPath, copyFolderPath);
});
