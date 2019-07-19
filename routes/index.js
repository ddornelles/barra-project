const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/beaches', (req, res, next) => {
  res.render('beaches', { GMAPS: process.env.GMAPS });
});

module.exports = router;
