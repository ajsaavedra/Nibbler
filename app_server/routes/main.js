const router = require('express').Router();
const location = require('../../app_api/models/locations');
const user = require('../../app_api/models/user');
const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.renderHomePage);

module.exports = router;