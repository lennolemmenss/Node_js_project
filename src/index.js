
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const ejs = require('ejs');

// EJS als view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);



// Productenpagina op localhost:3000
app.get('/', (req, res) => {
  res.render('product');
});

// Product-postpagina, de pagina voor het posten van nieuwe producten
app.get('/product-post', (req, res) => {
  res.render('product-post');
});

// fictieve about pagina
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/sources', (req, res) => {
  res.render('sources');
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
