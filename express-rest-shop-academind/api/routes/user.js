const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
/*
    for more ref, go to the https://github.com/kelektiv/node.bcrypt.js
*/
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



/*
    two routes, sign in, sign up
*/

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email }) ///check if user exists
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                })
            } else {
                //at first you need to hash bcoz it's an async & cpu costing operation
                // 10 is hash rounding
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) { //if error return error
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        
                        user
                            .save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch((err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            }));
                    }//
                });


            }//else 
        })
       


})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.UserId})
      .exec()
      .then(result => {
          console.log(result)
          res.status(200).json({
              message: "User deleted"
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
})

//must content-type = application/json in headers
router.post('/login', (req, res, next) => {
    console.log("login password", req.body.password)
    User.find({email: req.body.email})
      .exec()
      .then((users) => { //find method return an array of objects so users 
          if(users.length < 1) {
            /*
                Do not use 404 error, use 401
                Don't clarify that 'email not found' , simply return Auth failed
            */
            return res.status(401).json({
                message: 'Auth failed' 
            })
          }
          bcrypt.compare(req.body.password, users[0].password, (err, result) => {
              if(err){
                  return res.status(401).json({
                      message: 'Auth failed'
                  })
              }
              //if Auth successful then return a jwt token
              if(result) {
                const token = jwt.sign({
                      email: users[0].email,
                      userId: users[0]._id
                  }, process.env.JWT_KEY, // private key for token generation 
                  { //options
                    expiresIn: "1hr"
                  }
                  );
                  return res.status(200).json({
                      message: 'Auth successful',
                      token : token
                  })
              }
              res.status(401).json({
                  message: 'Auth failed', 
                  
              })
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      });
})


module.exports = router;