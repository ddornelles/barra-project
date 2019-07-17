const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/beaches', (req, res, next) => {
  res.render('beaches', { GMAPS: process.env.GMAPS });
});

/* router.get('/barraca', (req, res, next) => {
  res.render('barraca');
}); */

/* router.get('/profile', (req, res, next) => {
  res.render('user/profile');
}); */

router.get('/reserva/user', (req, res, next) => {
  res.render('reserva/user');
});

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile');
});

router.get('/user/edit', (req, res, next) => {
  res.render('user/edit-user');
});

router.get('/vendor', (req, res, next) => {
  res.render('auth/vendor');
});

/* router.get('/barraqueiro', (req, res, next) => {
  res.render('vendor/profile');
}); */

module.exports = router;
