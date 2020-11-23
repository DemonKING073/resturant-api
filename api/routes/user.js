require('dotenv').config();
const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


const UserController = require('../controllers/user');  

router.get('/', UserController.user_get_all);

router.get('/:userId',checkAuth,UserController.user_info);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete);

module.exports = router;