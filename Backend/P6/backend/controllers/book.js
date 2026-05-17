const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
   console.log('req.body.book:', req.body.book);
   console.log('req.file:', req.file);
   const bookObject = JSON.parse(req.body.book);
   delete bookObject._id;
   delete bookObject._userId;
   const book = new Book({
       ...bookObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
 
   book.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  let bookObject = {};

  try {
    if (req.body.book) {
      bookObject = JSON.parse(req.body.book);
    } else {
      bookObject = req.body;
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (req.file) {
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  Object.keys(bookObject).forEach(key => {
    if (bookObject[key] === undefined || bookObject[key] === "") {
      delete bookObject[key];
    }
  });

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "unauthorized request" });
      }

      if (req.file && book.imageUrl) {
        try {
          const oldFilename = book.imageUrl.split('/images/')[1];
          const oldPath = path.join(__dirname, '..', 'images', oldFilename);

          fs.unlink(oldPath, (err) => {
            if (err) {
              console.log("Erreur suppression ancienne image :", err.message);
            }
          });
        } catch (err) {
          console.log("Erreur parsing ancienne image :", err.message);
        }
      }

      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      );
    })
    .then(() => res.status(200).json({ message: "Objet modifié!" }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(403).json({ message : 'unauthorized request'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllBooks = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.rateBook = (req, res, next) => { 
Book.findOne({ _id: req.params.id })
.then((book) => {
           if (book.ratings.find (rating => rating.userId.toString() === req.auth.userId))
            {return res.status(403).json({ message : 'Vous avez déjà noté ce livre'});}
               book.ratings.push({ userId: req.auth.userId, grade: req.body.rating});
               let total = 0;
       for (let rating of book.ratings) {
         total += rating.grade;
       }
       book.averageRating = total / book.ratings.length;
       book.averageRating = Math.round(book.averageRating * 10) / 10; // une décimale
       return book.save();
       })
       
.then(() => res.status(200).json({message : 'Note ajoutée!'}))
.catch (error =>  res.status(400).json({ error }))};
      

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      if (!books || books.length === 0) {
        return res.status(404).json({ message: 'Aucun livre trouvé' });
      }
      books.sort((a, b) => b.averageRating - a.averageRating);
      const top3 = books.slice(0, 3);

      res.status(200).json(top3);
    })
    .catch((error) => res.status(500).json({ error }));
};
 
