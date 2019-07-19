const express = require('express');

const routerAuth = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/user');

// signup for users
routerAuth.get('/signup', ensureLoggedOut(), (req, res, next) => {
  res.render('./auth/signup');
});


routerAuth.post('/signup', (req, res, next) => {
  const { name, username, password, promotionalEmail, role } = req.body;

  // will create the auth token generating a random combinantion
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i += 1) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  // check for empty strings

  if (name === '' || password === '' || username === '') {
    res.render('auth/signup', { message: 'Indicate name, password and email' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'Email or password invalid' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        password: hashPass,
        confirmationCode: token,
        username,
        promotionalEmail,
        role,
      });

      const transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      newUser.save()
        .then(() => {
          transport.sendMail({
            from: '"My Awesome Project 👻" <myawesome@project.com>',
            to: username,
            subject: 'Confirme sua conta',
            text: 'something something',
            html: `Click <a href="http://localhost:3000/confirmation/${newUser.confirmationCode}"> Aqui </a> para confirmar sua conta!`,
          })
            .then(() => res.redirect('/login'))
            .catch(error => console.log(error));
        })
        .catch((err) => {
          console.log(err);
          res.render('auth/signup', { message: 'Something went wrong' });
        });
    });
});


// confirmation route
routerAuth.get('/confirmation/:code', (req, res) => {
  const { code } = req.params;
  User.find({ confirmationCode: { $eq: code } })
    .then((result) => {
      User.update({_id: result[0]._id}, { confirmedEmail: true })
        .then(() => {
          res.render('./auth/confirmation', result[0]);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// login access point

routerAuth.get('/login', (req, res) => {
  res.render('./auth/login', { message: req.flash('error') });
});

routerAuth.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

// logout handler

routerAuth.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = routerAuth;
