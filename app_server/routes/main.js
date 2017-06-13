const router = require('express').Router();
const location = require('../../app_api/models/locations');
const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.renderHomePage);
router.get('/locate', ctrlMain.renderLocatePage);
router.get('/locate/:locationid', ctrlMain.renderLocationDetailsPage);

module.exports = router;