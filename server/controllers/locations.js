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

const getLocationHours = function(locationHours) {
    let hours = [];
    locationHours.forEach(hour => {
        hours.push({
            day: hour.day,
            opening: hour.opening,
            closing: hour.closing
        });
    });
    return hours;
};

module.exports.locationsCreate = function(req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        options: req.body.options,
        coords: [parseFloat(req.body.lng).toFixed(4), parseFloat(req.body.lat).toFixed(4)],
        openingTimes: getLocationHours(req.body.hours)
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
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            'message': 'locationid required'
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec(function(err, location) {
            if (!location) {
                sendJsonResponse(res, 404, {
                    'message': 'locationid not found'
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }

            location.name = req.body.name;
            location.address = req.body.address;
            location.options = req.body.options.split(',');
            location.coords = [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)];
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }];
            location.save(function(err, location) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, location);
                }
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
    const uname = req.params.uname;
    if (!uname) return sendJsonResponse(res, 400, {'message': 'username required'});
    Loc
        .find({ 'reviews.author': uname })
        .exec(function(err, docs) {
            if (err) return sendJsonResponse(res, 500, err);
            let userReviews = {};
            docs.forEach(doc => {
                const name = doc.name;
                doc.reviews.forEach(review => {
                    if (review.author === uname) userReviews[doc._id + ':' + name] = review;
                });
            });
            sendJsonResponse(res, 200, userReviews);
        });
};
