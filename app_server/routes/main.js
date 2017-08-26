const router = require('express').Router();
const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.renderHomePage);

module.exports = router;