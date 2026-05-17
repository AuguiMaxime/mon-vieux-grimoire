const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {
  if (!req.file) return next(); // pas de fichier → on passe

  const inputPath = `images/${req.file.filename}`;
  const tempPath = `images/temp-${req.file.filename}`;

  sharp(inputPath)
    .resize({ width: 800 })
    .jpeg({ quality: 70 })
    .toFile(tempPath)
    .then(() => {
      fs.rename(tempPath, inputPath, (err) => {
        if (err) return res.status(500).json({ message: 'Erreur traitement image', error: err });
        next(); // tout ok → on continue
      });
    })
    .catch(err => res.status(500).json({ message: 'Erreur traitement image', error: err }));
};