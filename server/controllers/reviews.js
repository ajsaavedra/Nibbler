const mongoose = require('mongoose');
const Loc = mongoose.model('Location');
const sendJsonResponse = require('../../config/tools').sendJsonResponse;

var addReview = function(req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            'message': 'locationid required'
        });
    } else {
        location.reviews.push({
            author: req.body.author,
            title: req.body.title,
            rating: req.body.rating,
            reviewText: req.body.review
        });
        location.save(function(err, location) {
            var review;
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                review = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, review);
            }
        });
    }
}

var updateAverageRating = function(locationid) {
    Loc
        .findById(locationid)
        .select('rating reviews')
        .exec(function(err, location) {
            if (!err) {
                setAverageRating(location);
            }
        });
};

var setAverageRating = function(location) {
    var reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        location.reviews.forEach(function(element) {
            ratingTotal += element.rating;
        }, this);
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

module.exports.reviewsCreate = function(req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
            .findById(locationid)
            .select('reviews')
            .exec(function(err, location) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    addReview(req, res, location);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            'message': 'Not found, locationid required'
        });
    }
};
module.exports.reviewsReadOne = function(req, res) {
    if (!req.params || !req.params.locationid || !req.params.reviewid) {
        return sendJsonResponse(res, 404, {
            'message': 'Not found. Both locationid and reviewid required.'
        });
    }
    Loc
        .findById(req.params.locationid)
        .select('name reviews')
        .exec(
            function(err, location) {
                var response, review;
                if (!location) return sendJsonResponse(res, 404, {'message': 'locationid not found'});
                if (err) return sendJsonResponse(res, 400, err);
                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);
                    if (!review) return sendJsonResponse(res, 404, {'message': 'reviewid not found'});
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review: review
                    };
                    return sendJsonResponse(res, 200, response);
                }
                return sendJsonResponse(res, 404, {'message': 'No reviews found'});
            }
        );
};
module.exports.reviewsUpdateOne = function(req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            'message': 'locationid and reviewid are both required'
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
            function(err, location) {
                var thisReview;
                if (!location) return sendJsonResponse(res, 404, {'message': 'locationid not found'});
                if (err) return sendJsonResponse(res, 400, err);
                if (!location.reviews || location.reviews.length === 0) {
                    thisReview = location.reviews.id(req.params.reviewid);
                    if (!thisReview) {
                        sendJsonResponse(res, 404, {
                            'message': 'reviewid not found'
                        });
                    } else {
                        thisReview.author = req.body.author;
                        thisReview.rating = req.body.rating;
                        this.reviewText = req.body.reviewText;
                        location.save(function(err, location) {
                            if (err) return sendJsonResponse(res, 404, err);
                            return sendJsonResponse(res, 200, thisReview);
                        });
                    }
                }
            }
        );
};
module.exports.reviewsDeleteOne = function(req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        return sendJsonResponse(res, 404, {
            'message': 'locationid and reviewid both required'
        });
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function(err, location) {
            if (!location) {
                return sendJsonResponse(res, 404, {
                    'message': 'location not found'
                });
            } else if (err) return sendJsonResponse(res, 400, err);
            if (location.reviews && location.reviews.length > 0) {
                location.reviews.id(req.params.reviewid).remove();
                location.save(function(err, saved) {
                    if (err) return sendJsonResponse(res, 500, err);
                    updateAverageRating(location._id);
                    sendJsonResponse(res, 204, {'message': 'review deleted'});
                });
                return;
            }
            return sendJsonResponse(res, 404, {
                'message': 'location has no reviews to delete'
            });
        });
};
