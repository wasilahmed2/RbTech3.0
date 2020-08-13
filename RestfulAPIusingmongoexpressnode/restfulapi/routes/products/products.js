var express = require('express');
var router = express.Router();


/* GET products page. */
router.get('/', function(req, res, next) {
  res.render('products', { title: 'Express' });
 
});

module.exports = router;
