const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const passport = require('passport');
const User = require('../models/user');
const Vendor = require('../models/vendor');
const uploadCloud = require('../config/cloudinary.js');


router.get('/profile', ensureLoggedIn(), (req, res, next) => {
  if (req.user.role === 'CLIENT') {
    User.findById(req.user.id)
      .then((answer) => {
        console.log(answer)
        res.render('./user/profile', answer);
      })
      .catch(err => console.log(`Fire!${err}`));
  } else if (req.user.role === 'VENDOR') {
    User.findById(req.user.id)
      .then((answer) => {
        console.log(answer);
        res.render('./vendor/dashboard', answer);
      })
      .catch(err => console.log(`Fire!${err}`));
  }
});

router.get('/edit-user', ensureLoggedIn(), (req, res, next) => {
  User.findById(req.user.id)
    .then((answer) => { res.render('./user/edit-user', answer); })
    .catch(err => console.log(`Fire!${err}`));
});

router.post('/edit-user', ensureLoggedIn(), uploadCloud.single('imgPath'), (req, res, next) => {
  console.log(req.body);
  const { email } = req.body;
  const { id } = req.user;

  if (email === '') {
    res.render('/edit-user', { message: 'Indicate a new email' });
    return;
  }

  User.update({ _id: id }, { $set: { email, imgName: req.user.id, imgPath: req.file.url } })
    .then((answer) => {
      console.log(answer);
      res.redirect('/profile');
    })
    .catch(err => console.log(`Fire!${err}`));
});


module.exports = router;
