const router = require('express').Router();
const ctrlUser = require('../controllers/user');

router.get('/login', ctrlUser.login);

router.route('/signup')
    .get(ctrlUser.signup)
    .post(ctrlUser.register);

module.exports = router;