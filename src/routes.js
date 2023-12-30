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



router.get('/', (req, res) => {
  db.query('SELECT * FROM producten', (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Fetch categories for dropdown
    db.query('SELECT * FROM categories', (err, categories) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the product.ejs view and pass the products and categories as variables
      res.render('product', { products: result, categories });
    });
  });
});


// Route voor het toevoegen van een product op localhost:3000
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
      res.redirect('/');
    }
  );
});

// Route voor het ophalen en weergeven van producten op localhost:3000
router.get('/', (req, res) => {
  db.query('SELECT * FROM producten', (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render de product.ejs view en geef de producten door als variabele
    res.render('product', { products: result });
  });
});

// Toevoegen van de delete-product route op localhost:3000
router.post('/delete-product/:id', (req, res) => {
  const productId = req.params.id;

  db.query('DELETE FROM producten WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Na succesvolle verwijdering, redirect naar de productenpagina
    res.redirect('/');
  });
});

// Route voor het weergeven van het update-product formulier
router.get('/update-product/:id', (req, res) => {
  const productId = req.params.id;

  // Fetch the product based on productId from the database
  db.query('SELECT * FROM producten WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error fetching product for update:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Fetch categories for dropdown
    db.query('SELECT * FROM categories', (err, categories) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the product-update.ejs view and pass the product and categories as variables
      res.render('product-update', { product: result[0], categories });
    });
  });
});

// Route for processing the update-product form
router.post('/update-product/:id', upload.single('foto'), (req, res) => {
  const productId = req.params.id;
  const { naam, prijs, merk, category } = req.body;
  const foto = req.file ? req.file.filename : null;

  // Execute the update query based on the submitted data
  db.query(
    'UPDATE producten SET naam = ?, prijs = ?, merk = ?, foto = ?, category_id = ? WHERE id = ?',
    [naam, prijs, merk, foto, category, productId],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // After a successful update, redirect to the products page or another desired page
      res.redirect('/');
    }
  );
});





// Route for rendering the product-post page with categories
router.get('/product-post', (req, res) => {
  db.query('SELECT * FROM categories', (err, categories) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('product-post', { categories });
  });
});


router.post('/add-category', (req, res) => {
  const { newCategory } = req.body;

  db.query('INSERT INTO categories (naam) VALUES (?)', [newCategory], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect('/product-post');
  });
});


// Route voor het verwijderen van een categorie
router.post('/delete-category', (req, res) => {
  const { deleteCategory } = req.body;

  // Controleer eerst of er producten zijn gekoppeld aan de categorie
  db.query('SELECT COUNT(*) AS count FROM producten WHERE category_id = ?', [deleteCategory], (err, result) => {
    if (err) {
      console.error('Error checking linked products:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const hasLinkedProducts = result[0].count > 0;

    if (hasLinkedProducts) {
      // Render de product-post.ejs pagina met een melding over gekoppelde producten
      db.query('SELECT * FROM categories', (err, categories) => {
        if (err) {
          console.error('Error fetching categories:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.render('product-post', {
          categories,
          error: 'Er zijn producten gekoppeld aan deze categorie. Verwijder de producten eerst.',
        });
      });
    } else {
      // Geen gekoppelde producten, verwijder de categorie
      db.query('DELETE FROM categories WHERE id = ?', [deleteCategory], (err, result) => {
        if (err) {
          console.error('Error deleting category:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Render de product-post.ejs pagina met een succesmelding
        db.query('SELECT * FROM categories', (err, categories) => {
          if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.render('product-post', {
            categories,
            success: 'Categorie succesvol verwijderd.',
          });
        });
      });
    }
  });
});


module.exports = router;



