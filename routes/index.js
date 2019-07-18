const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/beaches', (req, res, next) => {
  res.render('beaches', { GMAPS: process.env.GMAPS });
});

router.get('/vendor/profile', (req, res, next) => {
  res.render('/vendor/profile');
});

router.get('/reserva/user', (req, res, next) => {
  res.render('reserva/user');
});

router.get('/reserva/vendor', (req, res, next) => {
  res.render('reserva/vendor');
});

router.get('/vendor/edit', (req, res, next) => {
  res.render('vendor/edit-vendor');
});

router.get('/vendor/edit-barraca', (req, res, next) => {
  res.render('vendor/edit-barraca');
});

router.get('/vendor/add-barraca', (req, res, next) => {
  res.render('vendor/add-barraca');
});

router.get('/vendor/reserva-barraca', (req, res, next) => {
  res.render('vendor/reserva-barraca');
});

router.get('/vendor/edit-produtos', (req, res, next) => {
  res.render('vendor/edit-produtos');
});

/* router.get('/barraqueiro', (req, res, next) => {
  res.render('vendor/profile');
}); */

module.exports = router;
