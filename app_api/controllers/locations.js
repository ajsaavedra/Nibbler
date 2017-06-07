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
        mToKm : mToKm,
        kmToM : kmToM
    };
})();

const sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = function(req, res) {
    const longitude = parseFloat(req.query.lng);
    const latitude = parseFloat(req.query.lat);
    const point = {
        type: "Point",
        coordinates: [longitude, latitude]
    };
    const geoOptions = { 
        spherical: true, 
        maxDistance: meterConversion.milesToM(1),
        num: 10
     };
     if (!longitude || !latitude) {
         sendJsonResponse(res, 404, {
             "message": "longitude and latitude required"
         });
         return;
     }
     Loc.geoNear(point, geoOptions, function(err, results, stats) {
        var locations = [];
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function(doc) {
                console.log(doc.dis);
                    locations.push({
                        distance: meterConversion.mToMi(doc.dis),
                        name: doc.obj.name,
                        address: doc.obj.address,
                        rating: doc.obj.rating,
                        options: doc.obj.options,
                        _id: doc.obj._id
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
        options: req.body.options.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }], function(err, loction) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 201, location);
            }
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
                        "message": "locationid not found"
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
            "message": "locationid missing in request"
        });
    }
};

module.exports.locationsUpdateOne = function(req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            "message": "locationid required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec(
            function(err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }

                location.name = req.body.name;
                location.address = req.body.address;
                location.options = req.body.options.split(",");
                location.coords = [parseFloat(req.body.lng),
                                    parseFloar(req.body.lat)];
                location.openingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1,
                }, {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2,
                }];
                location.save(function(err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, location);
                    }
                });
            }
    );
};

module.exports.locationsDeleteOne = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};