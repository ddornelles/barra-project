const express = require('express');
const routerAuth = express.Router();
const User = require('../models/user');

/* GET home page */
routerAuth.get('/', (req, res, next) => {
  res.render('index');
});

// signup for users

routerAuth.get('/user-signup', (req, res, next) => {
  res.render('index');
});

routerAuth.post('/user-signup', (req, res, next) => {

});

// signup for vendors

routerAuth.get('/vendor-signup', (req, res, next) => {
  res.render('index');
});

routerAuth.post('/vendor-signup', (req, res, next) => {

});

module.exports = routerAuth;
