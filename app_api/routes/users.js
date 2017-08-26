const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

router.post('/users/new', ctrlUsers.registerUser);
router.post('/users/:username', ctrlUsers.getUserProfile);
// router.get('/users/:username', ctrlUsers.isLoggedIn, ctrlUsers.getUserProfile);

module.exports = router;