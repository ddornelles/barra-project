const express = require('express');

const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');
const Barraca = require('../models/barraca');
const Products = require('../models/products');
const Reserva = require('../models/reserva');
const uploadCloud = require('../config/cloudinary.js');

router.get('/reserva/:id', ensureLoggedIn(), (req, res, next) => {
  const { id } = req.params;
  Barraca.findById(id)
    .populate('products')
    .then((beachStand) => {
      res.render('./reserva/barraca', { beachStand });
    })
    .catch()
})

router.post('/reserva/:barracaId', (req, res, next) => {
  const { barracaId } = req.params;
  const { cadeira, barraca, cadeiraPrice, barracaPrice } = req.body;
  const check = cadeiraPrice * cadeira + barracaPrice * barraca;
  const products = {
    cadeira: {
      price: cadeiraPrice,
      amount: barraca,
    },
    barraca: {
      price: barracaPrice,
      amount: cadeira,
    },
  };

  const newReserva = new Reserva({
    user: req.user.id,
    business: barracaId,
    products,
    total: check,
  });

  Products.findOne({ business: barracaId })
    .then((answer) => {
      if (answer.cadeira.amount - cadeira >= 0
        && answer.barraca.amount - barraca >= 0) {
        const upCadeira = answer.cadeira.amount - cadeira;
        const upBarraca = answer.barraca.amount - barraca;
        Products.update({ business: barracaId }, {
          $set: {
            cadeira: {
              price: answer.cadeira.price,
              amount: upCadeira,
            },
            barraca: {
              price: answer.cadeira.price,
              amount: upBarraca,
            },
          },
        })
          .then(() => {
            newReserva.save()
              .then(() => {
                res.redirect('/reserva');
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err))
      } else {
        Barraca.findById(barracaId)
          .populate('products')
          .then((beachStand) => {
            res.render('./reserva/barraca', {
              beachStand,
              message: 'Não é possivel reservar essa quantidade de produtos no momento',
            });
          })
          .catch()
      }
    })
    .catch(err => console.log(err))
});

router.get('/reserva', ensureLoggedIn(), (req, res, next) => {
  Reserva.find({ user: req.user.id })
    .populate('business')
    .then((answer) => {
      res.render('reserva/user', { answer });
    })
    .catch(err => console.log(err))
});

router.get('/reserva/vendor/:id', ensureLoggedIn(), (req, res, next) => {
  const { id } = req.params;
  Reserva.find({ business: id })
    .populate('user')
    .then((answer) => {
      res.render('./reserva/vendor', { answer });
    })
});

router.get('/cancel/:reservaId', (req, res, next) => {
  const { reservaId } = req.params;
  Reserva.findOne({ _id: reservaId })
    .then((answer) => {
      const reservaCadeira = answer.products.cadeira.amount;
      const reservaBarraca = answer.products.barraca.amount;
      Products.findOne({ business: answer.business[0] })
        .then((product) => {
          const upCadeira = product.cadeira.amount + reservaCadeira;
          const upBarraca = product.barraca.amount + reservaBarraca;
          Products.update({ business: answer.business[0] }, {
            $set: {
              cadeira: {
                price: product.cadeira.price,
                amount: upCadeira,
              },
              barraca: {
                price: product.barraca.price,
                amount: upBarraca,
              },
            },
          })
            .then(() => {
              Reserva.findByIdAndDelete({ _id: reservaId })
                .then(() => res.redirect('/reserva/'))
                .catch(() => console.log(err));
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
});

module.exports = router;
