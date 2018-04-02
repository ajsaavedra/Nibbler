const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

module.exports = function(passport) {
    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.get('/locations', ctrlLocations.locationsListByDistance);
    router.post('/locations', ctrlAuth.isAuth, ctrlLocations.locationsCreate);
    router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
    router.put('/locations/:locationid',ctrlAuth.isAuth, ctrlLocations.locationsUpdateOne);
    router.delete('/locations/:locationid', ctrlAuth.isAuth, ctrlLocations.locationsDeleteOne);
    router.get('/locations-get-user-reviews/:uname', ctrlLocations.locationsGetReviewsByAuthor);

    router.post('/locations/:locationid/reviews',ctrlAuth.isAuth, ctrlReviews.reviewsCreate);
    router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
    router.put('/locations/:locationid/reviews/:reviewid',ctrlAuth.isAuth, ctrlReviews.reviewsUpdateOne);
    router.delete('/locations/:locationid/reviews/:reviewid',ctrlAuth.isAuth, ctrlReviews.reviewsDeleteOne);
    return router;
}
