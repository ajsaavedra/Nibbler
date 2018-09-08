const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

var meterConversion = (function() {
    var miToM = function(miles) {
        return parseFloat(miles * 1609.344);
    };

    var mToMi = function(meters) {
        return parseFloat(meters / 1609.344);
    };

    var mToKm = function(distance) {
        return parseFloat(distance / 1000);
    };

    var kmToM = function(distance) {
        return parseFloat(distance * 1000);
    };

    return {
        miToM: miToM,
        mToMi: mToMi,
        mToKm: mToKm,
        kmToM: kmToM
    };
})();

const sendJsonResponse = require('../../config/tools').sendJsonResponse;

module.exports.locationsListByDistance = function(req, res) {
    const longitude = parseFloat(req.query.lng);
    const latitude = parseFloat(req.query.lat);
    const point = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };
    if ((!longitude && longitude !== 0) || (!latitude && latitude !== 0)) {
        sendJsonResponse(res, 404, {
            'message': 'longitude and latitude required'
        });
        return;
    }
    Loc.aggregate([
        {
            $geoNear: {
                near: point,
                distanceField: 'dist.calculated',
                spherical: true,
                maxDistance: meterConversion.miToM(req.query.maxDistance),
                num: 50
            }
        },
        {
            $skip: parseInt(req.query.offset || 0)
        }
    ]).exec((err, results) => {
        var locations = [];
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function(doc) {
                locations.push({
                    distance: meterConversion.mToMi(doc.dist.calculated),
                    name: doc.name,
                    address: doc.address,
                    rating: doc.rating,
                    options: doc.options,
                    reviews: doc.reviews,
                    _id: doc._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};

module.exports.locationsCreate = function(req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        coords: [parseFloat(req.body.lng).toFixed(4), parseFloat(req.body.lat).toFixed(4)],
        openingTimes: req.body.hours
    }, function(err, location) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, location);
        }
    });
};

module.exports.locationsReadOne = function(req, res) {
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function(err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        'message': 'locationid not found'
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, {
            'message': 'locationid missing in request'
        });
    }
};

module.exports.locationsUpdateOne = function(req, res) {
    if (!req.params.locationid) { return res.status(404).send({ message: 'locationid required' }); }
    Loc
        .findById(req.params.locationid)
        .exec(function(err, location) {
            if (!location) return res.status(404).send({ message: 'locationid not found' });
            else if (err) return res.status(400).send(err);
            location.name = req.body.name;
            location.address = req.body.address;
            location.coords = [parseFloat(req.body.lng).toFixed(4), parseFloat(req.body.lat).toFixed(4)];
            location.openingTimes = req.body.hours;
            location.reviews = location.reviews;
            location.save(function(err, updated) {
                if (err) { return res.status(404).send(err) }
                return res.status(200).send(updated);
            });
        });
};

module.exports.locationsDeleteOne = function(req, res) {
    var locationid = req.params.locationid;
    if (!locationid) {
        sendJsonResponse(res, 400, {
            'message': 'locationid required'
        });
    } else {
        Loc
            .findByIdAndRemove(locationid)
            .exec(function(err, location) {
                if (err) {
                    sendJsonResponse(res, 500, err);
                } else {
                    sendJsonResponse(res, 204, {'message': 'Deleted'});
                }
            });
    }
};

module.exports.locationsGetReviewsByAuthor = function(req, res) {
    if (req.err) return sendJsonResponse(res, 500, req.err);
    if (!req.existingUser) return sendJsonResponse(res, 404, req.err);
    Loc
        .find({ 'reviews.author': req.existingUser.profile.username })
        .exec(function(err, docs) {
            if (err) return sendJsonResponse(res, 500, err);
            let userReviews = {};
            docs.forEach(doc => {
                const name = doc.name;
                doc.reviews.forEach(review => {
                    if (review.author === req.existingUser.profile.username) userReviews[doc._id + ':' + name] = review;
                });
            });
            sendJsonResponse(res, 200, userReviews);
        });
};
