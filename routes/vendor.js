const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');
const Barraca = require('../models/barraca');
const uploadCloud = require('../config/cloudinary.js');

router.get('/cadastro', ensureLoggedIn(), (req, res, next) => {
  res.render('./vendor/querobarraca', { GMAPS: process.env.GMAPS });
});

router.post('/cadastro', uploadCloud.single('imgPath'), (req, res, next) => {
  console.log(req.body);
  const { name, latitude, longitude, description } = req.body;
  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  const newBarraca = new Barraca({
    name,
    imgPath: req.file.url,
    imgName: req.user.id,
    location,
    description,
    owner: req.user.id,
  });

  newBarraca.save()
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => console.log(err));
});

router.get('/api', (req, res, next) => {
  Barraca.find()
    .then((barracas) => {
      res.status(200).json({ barracas });
    })
    .catch(error => console.log(error));
 });

router.get('/reserva/:id', ensureLoggedIn(), (req, res, next) => {
  const { id } = req.params;
  /* Barracas.findOneById(id)
    .then(answer => res.render()) */
    res.render('./reserva/barraca');
})

module.exports = router;
