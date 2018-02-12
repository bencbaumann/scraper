var express = require('express');
var router = express.Router();

const db = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = {};
  data.title = "Home";
  data.scrape = true;
  res.render('index', data);
});

module.exports = router;
