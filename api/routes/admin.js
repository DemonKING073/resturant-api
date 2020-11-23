require('dotenv').config();
const express = require('express');
const router = express.Router();

const checkAuth = (require('../middleware/check-auth'))

const AdminController = require('../controllers/admin');

router.post('/signup', AdminController.admin_signup);

router.post('/login',AdminController.admin_login);

router.post('/passchange',AdminController.admin_password_change);

router.get('/:user',checkAuth,AdminController.admin_authenticate);


module.exports = router;