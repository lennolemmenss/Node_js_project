// src/routes.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route voor het toevoegen van een product
router.post('/add-product', upload.single('foto'), (req, res) => {
  const { naam, prijs, merk } = req.body;
  const foto = req.file.filename;

  db.query(
    'INSERT INTO producten (naam, prijs, merk, foto) VALUES (?, ?, ?, ?)',
    [naam, prijs, merk, foto],
    (err, result) => {
      if (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Na succesvolle toevoeging, redirect naar de productenpagina
      res.redirect('/api/products');
    }
  );
});


router.get('/products', (req, res) => {
  db.query('SELECT * FROM producten', (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render de products.ejs view en geef de producten door als variabele
    res.render('product', { products: result });
  });
});





// Toevoegen van de delete-product route
router.post('/delete-product/:id', (req, res) => {
  const productId = req.params.id;

  db.query('DELETE FROM producten WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Na succesvolle verwijdering, redirect naar de productenpagina
    res.redirect('/api/products');
  });
});



module.exports = router;




