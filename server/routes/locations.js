const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlUsers = require('../controllers/users');

require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', requireAuth, ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', requireAuth, ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', requireAuth, ctrlLocations.locationsDeleteOne);
router.get('/locations-get-user-reviews/:uname', ctrlUsers.findUserByName, ctrlLocations.locationsGetReviewsByAuthor);

router.post('/locations/:locationid/reviews', requireAuth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', requireAuth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', requireAuth, ctrlReviews.reviewsDeleteOne);

module.exports = router;
