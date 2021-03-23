const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

const User = require('../models/user')

const UserController = require('../controllers/user');

router.post("/signup", UserController.user_signup)


router.get("/", UserController.user_get_all)

router.post("/login", UserController.user_login)

router.delete('/:userId', UserController.user_delete)



module.exports = router