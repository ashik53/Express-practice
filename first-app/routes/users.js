var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//example
router.get('/detail', (req, res, next) => {
  res.send('detail');
})

module.exports = router;
