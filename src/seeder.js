// seeder.js

const db = require('./db');

const categories = [
  'Gaming',
  'Coding',
  'Split board'
];

const products = [
  { name: 'Keychron K2', price: 99.99, brand: 'Keychron', photo: 'keyboard1.jpg', categoryName: 'Coding' },
  { name: 'Vortex Multix 87', price: 124.95, brand: 'MX', photo: 'Vortex Multix 87.jpg', categoryName: 'Coding' },
  { name: 'Keychron C3 Pro', price: 100, brand: 'Keychron', photo: 'Keychron C3 Pro.jpg', categoryName: 'Coding' },
  { name: 'Obinslab Anne Pro 2', price: 200, brand: 'Obinslab', photo: 'Obinslab Anne Pro 2.jpg', categoryName: 'Coding' },
  { name: 'Logitech Pro X Keyboard', price: 150, brand: 'Logitech', photo: 'Logitech Pro X Keyboard.jpg', categoryName: 'Gaming' },
  
  { name: 'Corsair K95 RGB Platinum', price: 170.99, brand: 'Corsair', photo: 'CorsairK95RGB.jpg', categoryName: 'Gaming' },
  { name: 'Razer BlackWidow Elite', price: 130.49, brand: 'Razer', photo: 'RazerBlackWidow.jpg', categoryName: 'Gaming' },
  { name: 'SteelSeries Apex Pro', price: 199.99, brand: 'SteelSeries', photo: 'SteelSeriesApexPro.jpg', categoryName: 'Gaming' },
  { name: 'HyperX Alloy FPS Pro', price: 69.99, brand: 'HyperX', photo: 'HyperXAlloy.jpg', categoryName: 'Gaming' },
  
  { name: 'Das Keyboard 4 Professional', price: 169.00, brand: 'Das Keyboard', photo: 'DasKeyboard4.jpg', categoryName: 'Coding' },
  { name: 'Filco Ninja Majestouch-2', price: 139.99, brand: 'Filco', photo: 'FilcoNinja.jpg', categoryName: 'Coding' },
  { name: 'Ducky Shine 7', price: 159.00, brand: 'Ducky', photo: 'DuckyShine7.jpg', categoryName: 'Coding' },
  { name: 'Happy Hacking Keyboard Professional 2', price: 241.00, brand: 'HHK', photo: 'HHKPro2.jpg', categoryName: 'Coding' },
  
  { name: 'Roccat Vulcan 121 Aimo', price: 159.99, brand: 'Roccat', photo: 'RoccatVulcan.jpg', categoryName: 'Gaming' },
  { name: 'Alienware Pro Gaming Keyboard AW768', price: 89.99, brand: 'Alienware', photo: 'AlienwareAW768.jpg', categoryName: 'Gaming' },


  { name: 'ErgoDox EZ', price: 325.00, brand: 'ErgoDox', photo: 'ErgoDoxEZ.jpg', categoryName: 'Split board' },
  { name: 'Kinesis Freestyle Edge RGB', price: 219.00, brand: 'Kinesis', photo: 'KinesisFreestyleEdge.jpg', categoryName: 'Split board' },
  { name: 'Dygma Raise', price: 299.00, brand: 'Dygma', photo: 'DygmaRaise.jpg', categoryName: 'Split board' },
  { name: 'Mistel Barocco MD600 RGB', price: 169.99, brand: 'Mistel', photo: 'MistelBarocco.jpg', categoryName: 'Split board' },
  { name: 'Matias Ergo Pro', price: 200.00, brand: 'Matias', photo: 'MatiasErgoPro.jpg', categoryName: 'Split board' },
  { name: 'ZSA Moonlander Mark I', price: 365.00, brand: 'ZSA', photo: 'ZSAMoonlander.jpg', categoryName: 'Split board' },
  { name: 'Ultimate Hacking Keyboard', price: 275.00, brand: 'UHK', photo: 'UltimateHackingKeyboard.jpg', categoryName: 'Split board' }
];

// Gebruik van Promises, eerst categorieën seeden, daarna prodcucten.

const seedCategories = () => {
  return new Promise((resolve, reject) => {
    let completed = 0;
    categories.forEach(category => {
      let query = 'INSERT INTO categories (naam) VALUES (?)';
      db.query(query, [category], (err, result) => {
        if (err) {
          console.error('Error seeding category:', err);
          reject(err);
        } else {
          console.log(`Category ${category} added successfully`);
          completed++;
          if (completed === categories.length) {
            resolve();
          }
        }
      });
    });
  });
};

const seedProducts = () => {
  return new Promise((resolve, reject) => {
    let completed = 0;
    products.forEach(product => {
  
    
      // Id zoeken van de category
      let categoryQuery = 'SELECT id FROM categories WHERE naam = ?';
      db.query(categoryQuery, [product.categoryName], (categoryErr, categoryResult) => {
        if (categoryErr) {
          console.error('Error finding category:', categoryErr);
          reject(categoryErr);
          return;
        }

        if (categoryResult.length === 0) {
          console.error(`Category not found for ${product.categoryName}`);
          reject(`Category not found for ${product.categoryName}`);
          return;
        }

        let categoryId = categoryResult[0].id;

      
        let productQuery = 'INSERT INTO producten (naam, prijs, merk, foto, category_id) VALUES (?, ?, ?, ?, ?)';
        db.query(productQuery, [product.name, product.price, product.brand, product.photo, categoryId], (productErr, productResult) => {
          if (productErr) {
            console.error('Error seeding product:', productErr);
            reject(productErr);
          } else {
            console.log(`Product ${product.name} added successfully`);
            completed++;
            if (completed === products.length) {
              resolve();
            }
          }
        });
      });
    });
  });
};

// Eerst categorieën seeden, daarna producten.
seedCategories()
  .then(seedProducts)
  .then(() => {
    console.log('All categories and products added successfully.');
    db.end();
  })
  .catch(err => {
    console.error('An error occurred during seeding:', err);
    db.end();
  });
