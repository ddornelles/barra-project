const express = require('express');
const routerAuth = express.Router();
const ensureLoggedIn = require('connect-ensure-login');
const ensureLoggedOut = require('connect-ensure-login');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const nodemailer = require('nodemailer');
const passport = require('passport');
const flash = require('connect-flash');

// check role for the user

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkGuest = checkRoles('CLIENT');
const checkEditor = checkRoles('VENDOR');


/* GET home page */
routerAuth.get('/', (req, res, next) => {
  res.render('index');
});

// signup for users

routerAuth.get('/user-signup', (req, res, next) => {
  res.render('./auth/signup');
});

routerAuth.post('/user-signup', (req, res, next) => {
  const { username, email, password } = req.body;

  // will create the auth token generating a random combinantion
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i += 1) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  // check for empty strings

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  if (email === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        confirmationCode: token,
        email,
      });

      const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
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
            to: email,
            subject: 'Confirme sua conta',
            text: 'something something',
            html: `Click <a href="http://localhost:3000/confirmation/${newUser.confirmationCode}"> Aqui </a> para confirmar sua conta!`,
          })
            .then(() => res.redirect('/'))
            .catch(error => console.log(error));
        })
        .catch((err) => {
          console.log(err);
          res.render('auth/signup', { message: 'Something went wrong' });
        });
    });

});

// signup for vendors

/*
routerAuth.get('/vendor-signup', (req, res, next) => {
  res.render('index');
});

routerAuth.post('/vendor-signup', (req, res, next) => {

});
*/

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

routerAuth.get('/login', (req, res, next) => {
  res.render('./auth/login');
});

routerAuth.post('/login', passport.authenticate('local', {
  successRedirect: '/',
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
