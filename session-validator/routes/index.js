var express = require('express');
const { request } = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //Comes errors after sumitting form 
  console.log(req.session.success);
  res.render('index', { title: 'Form validation', success: req.session.success, errors: req.session.errors }); 

  /* After rendering session's success & error variables values are  set to null to again calling this '/' route does not throw any validation
  */
  req.session.errors = null; 
  req.session.success = null;
});

router.post('/submit', function(req, res, next){
  //Check validity (that means whatever I am passing through post route)
  req.check('email' , 'Invalid email address').isEmail(); /*
    check is a method from validators ,
    this 'email' comes from forms 
    'Invalid email address' comes when error occurs
    isEmail() is a built in validator of email, check gethub for all validators
   */

   /*
      when use multiple validation use it like
      req.check('name').isLength({min:3}).withMessage('Name must be of 3 characters long.').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.')
      
   */
  req.check('pass1', 'Password should be at least 4 char').isLength({min:4})
  req.check('pass1', 'Passwords must be matched').equals(req.body.pass2)


  
  /* Multiple validation rules 
    make a chain, 
   */
  //req.check('pass1', 'Password should be at least 4 char').isLength({min:4}).equals(req.body.pass2)
   

   //validation errors stored into a variable
   var errors = req.validationErrors();
   if(errors){
      req.session.errors = errors;
      req.session.success = false;
   } else {
      req.session.success = true;
   }
   
   res.redirect('/')


})


module.exports = router;

