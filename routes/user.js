const express = require('express');
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require('../models/user');
const passport = require('passport');

router.get('/edit-user/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then((answer) => { res.render('/edit', answer)})
    .catch(err => console.log(`Fire!${err}`));
});

router.post('/edit-user/:id', (req, res, next) => {
  const { email, password } = req.body;
  const { id } = req.params;

  const profilePicture = {
    path: `/uploads/${req.file.filename}`,
  };

  User.update({ _id: id }, { $set: { email, password, profilePicture } })
    .then((answer) => {
      console.log(answer);
      res.redirect(`/edit-user/${id}`);
    })
    .catch(err => console.log(`Fire!${err}`));
});


module.exports = router;
