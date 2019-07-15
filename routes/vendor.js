const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');
const Barraca = require('../models/barraca');
const uploadCloud = require('../config/cloudinary.js');


router.post('/profile', uploadCloud.single('imgPath'), (req, res, next) => {
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
    .catch((err) => console.log(err))
});

module.exports = router;
