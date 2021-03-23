var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ashik', condition: true, anyArray: [1, 2, 3] }); //pass informations within an object
});

/* set up a new get route */
//:id is a parameter, you can access multiple parameters 
router.get('/test/:id', function(req, res, next){
  res.render('test', {output:req.params.id}); //render test.hbs file
})

/* a post route */
router.post('/test/submit', function(req, res, next){
  //form information comes inside req.body
  var id = req.body.id;
  //redirect to a page after submitting a request/ previous get request
  res.redirect('/test/' + id)
})
module.exports = router;

