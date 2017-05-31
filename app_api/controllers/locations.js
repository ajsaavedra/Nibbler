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
    sendJsonResponse(res, 200, {"status": "success"});
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
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsDeleteOne = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};