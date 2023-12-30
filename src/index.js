
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const ejs = require('ejs');

// Gebruik EJS als view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, '../views')));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);

// Product-post page at localhost:3000/product-post
app.get('/product-post', (req, res) => {
  res.render('product-post');
});

// Productenpagina op localhost:3000
app.get('/', (req, res) => {
  res.render('product');
});

// Product-postpagina op localhost:3000/product-post
app.get('/product-post', (req, res) => {
  res.render('product-post');
});

app.get('/about', (req, res) => {
  res.render('about');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
