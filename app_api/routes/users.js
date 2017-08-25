const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

router.post('/users/new', ctrlUsers.registerUser);

module.exports = router;