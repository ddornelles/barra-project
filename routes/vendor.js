const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');
const Barraca = require('../models/barraca');
const Products = require('../models/products');
const uploadCloud = require('../config/cloudinary.js');

router.get('/cadastro', ensureLoggedIn(), (req, res, next) => {
  res.render('./vendor/add-barraca', { GMAPS: process.env.GMAPS });
});

router.post('/cadastro', uploadCloud.single('imgPath'), (req, res, next) => {
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

router.get('/cadastro/produtos/:barracaId', (req, res, next) => {
  const { barracaId } = req.params;
  res.render('./vendor/add-produtos', { barracaId });
});

router.get('/edit/produtos/:productId', (req, res, next) => {
  const { productId } = req.params;
  Products.findById(productId)
    .then((answer) => {
      res.render('./vendor/edit-produtos', { answer });
    })
    .catch(err => console.log(err))
});

router.post('/edit/produtos/:productId', (req, res, next) => {
  const { productId } = req.params;
  const { barracaAmount, barracaPrice, cadeiraAmount, cadeiraPrice } = req.body;
  const cadeiraUp = {
    price: cadeiraPrice,
    amount: cadeiraAmount,
  };
  const barracaUp = {
    price: barracaPrice,
    amount: barracaAmount,
  };

  Products.update({ _id: productId }, { $set: { cadeira: cadeiraUp, barraca: barracaUp } })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => console.log(err))
});

router.post('/cadastro/produtos/:barracaId', (req, res, next) => {

  const { barracaId } = req.params;
  const productList = new Products({
    business: barracaId,
    cadeira: {
      //price is here as a test
      price: req.body.cadeiraPrice,
      amount: req.body.cadeiraAmount,
    },
    barraca: {
      //price is here as a test
      price: req.body.barracaPrice,
      amount: req.body.barracaAmount,
    },
  });
  productList.save()
    .then((savedProducts) => {
      const productsId = savedProducts._id;
      Barraca.update({ _id: barracaId }, { $set: { products: productsId } })
        .then(() => res.redirect('/profile'))
        .catch(err => console.log(err))
    })
    .catch(() => res.render(`/products/${barracaId}`, { message: 'Erro' }))
});

router.get('/barraca/edit/:barracaId', ensureLoggedIn(), (req, res, next) => {
  const { barracaId } = req.params;
  Barraca.findOne({ owner: barracaId })
    .then((answer) => {
      res.render('./vendor/edit-barraca', { answer, GMAPS: process.env.GMAPS });
    })
    .catch(err => console.log(err))
});

router.post('/barraca/edit/:barracaId', uploadCloud.single('imgPath'), (req, res, next) => {
  const { barracaId } = req.params;
  const { name, description } = req.body;
  Barraca.update({ _id: barracaId }, { $set: { name, description, imgPath: req.file.url } })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => console.log(err))
});

module.exports = router;
