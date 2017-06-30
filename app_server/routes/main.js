const router = require('express').Router();
const location = require('../../app_api/models/locations');
const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.renderHomePage);
router.get('/locate', ctrlMain.renderLocatePage);
router.get('/locate/:locationid', ctrlMain.renderLocationDetailsPage);
router.get('/locate/:locationid/reviews/new', ctrlMain.renderReviewFormPage);
router.post('/locate/:locationid/reviews/new', ctrlMain.addUserReview);

module.exports = router;