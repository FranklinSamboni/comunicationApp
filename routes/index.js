var express = require('express');
var router = express.Router();

/* GET home page. */

console.log("Se inicio el index");

router.all('/', function (req, res, next) {
    console.log('Accessing the secret section ...');
    //next(); // pass control to the next handler
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.status(200).send();
});

module.exports = router;
