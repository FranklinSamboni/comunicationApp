var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('router.get - index');
  res.render('index', { title: 'Express' });
  res.status(200).send();
});

module.exports = router;
