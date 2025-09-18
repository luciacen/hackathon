const { basePath } = require('./next.config'); // Usa require per importare il file

const fs = require('fs');
const path = require('path');

const cssFilePath = path.join(__dirname, 'src/app/globals.css');
const cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Sostituisci i percorsi relativi con il basePath
const updatedCssContent = cssContent.replace(/url\('\.\/fonts/g, `url('${basePath}/fonts`);

fs.writeFileSync(cssFilePath, updatedCssContent, 'utf8');
console.log('Percorsi dei font aggiornati con basePath:', basePath);