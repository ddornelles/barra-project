const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const passport = require('passport');
const User = require('../models/user');
const Barraca = require('../models/barraca');
const Reserva = require('../models/reserva');
const Products = require('../models/products');
const uploadCloud = require('../config/cloudinary.js');

router.get('/profile', ensureLoggedIn(), (req, res, next) => {
  let flag = true;
  let profileFlag = false;
  let productFlag = false;
  if (req.user.role === 'CLIENT') {
    User.findById(req.user.id)
      .then((answer) => {

        // Procura pela reserva do usuário
        Reserva.find({ user: req.user.id })
          .populate('business')
          .then((reserva) => {
            res.render('./user/profile', { answer, reserva });
          })
          .catch(err => console.log(err))

      })
      .catch(err => console.log(`Fire!${err}`));
  } else if (req.user.role === 'VENDOR') {
    User.findById(req.user.id)
      .then((answer) => {
        Barraca.find({ owner: req.user.id })
          .populate('products')
          .then((result) => {
            if (result.length >= 1) {
              flag = false;
              profileFlag = true;
              productFlag = true;
              res.render('./vendor/profile', { answer, flag, profileFlag, productFlag, result });
              // return;
            }
            res.render('./vendor/profile', { answer, flag, profileFlag, productFlag });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(`Fire!${err}`));
  }
});


router.get('/edit', ensureLoggedIn(), (req, res, next) => {
  User.findById(req.user.id)
    .then((answer) => {
      res.render('./user/edit-user', answer);
    })
    .catch(err => console.log(`Fire!${err}`));
});

router.post(
  '/edit',
  ensureLoggedIn(),
  uploadCloud.single('imgPath'),
  (req, res, next) => {
    const { name, username, age, contact, title, cpf } = req.body;
    const { id } = req.user;

    User.update(
      { _id: id },
      { $set: { name, username, age, contact, title, cpf, imgName: req.user.id, imgPath: req.file.url } }
    )
      .then((answer) => {
        res.redirect('/profile');
      })
      .catch(err => console.log(`Fire!${err}`));
  }
);

module.exports = router;
