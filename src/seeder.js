const path = require('path');
const fs = require('fs');

const db = require('./db'); // Zorg ervoor dat dit het juiste pad is naar je databaseverbinding

// Functie om willekeurige mechanische toetsenbordgegevens te genereren
function generateMechanicalKeyboard() {
  const keyboards = [
    { naam: 'Model 1', prijs: 99.99, merk: 'Brand1', foto: 'keyboard1.jpg' },
    { naam: 'Model 2', prijs: 129.99, merk: 'Brand2', foto: 'keyboard2.jpg' },
    { naam: 'Model 3', prijs: 149.99, merk: 'Brand3', foto: 'keyboard3.jpg' },
    // Voeg meer toetsenborden toe indien nodig
  ];

  return keyboards[Math.floor(Math.random() * keyboards.length)];
}

// Functie om mechanische toetsenborden in de database in te voegen
function seedDatabase(numKeyboards) {
  for (let i = 0; i < numKeyboards; i++) {
    const keyboard = generateMechanicalKeyboard();
    const imagePath = path.join(__dirname, '../public/uploads/', keyboard.foto);
    const sourceImagePath = path.join(__dirname, '../public/', keyboard.foto);

    console.log('Copying image from:', sourceImagePath);
    console.log('To:', imagePath);

    try {
      // Kopieer de afbeelding naar de juiste map
      const imageBuffer = fs.readFileSync(sourceImagePath);
      fs.writeFileSync(imagePath, imageBuffer);

      db.query(
        'INSERT INTO producten (naam, prijs, merk, foto) VALUES (?, ?, ?, ?)',
        [keyboard.naam, keyboard.prijs, keyboard.merk, keyboard.foto],
        (err, result) => {
          if (err) {
            console.error('Error seeding database:', err);
          } else {
            console.log('Keyboard seeded successfully:', keyboard.naam);
          }
        }
      );
    } catch (error) {
      console.error('Error copying image:', error);
    }
  }
}

// Voer de seed-functie uit met het gewenste aantal toetsenborden
seedDatabase(10); // Hier kun je het aantal gewenste toetsenborden specificeren
