const request = require('request');
const title = 'Vegan, Vegetarian, Gluten-Free Nibbles';
const apiOptions = {
    server: 'http://localhost:3000'
};
const renderLocations = function(req, res, responseBody) {
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else if (!responseBody.length) {
        message = "No places found nearby";
    }
    res.render('main/locate', {
        title: title,
        locations: responseBody,
        starRating: starRating,
        message: message
    });
};

const renderLocationDetails = function(req, res) {
    res.render('main/location-info', {
        title: title,
    });
}

const starRating = function(rating) {
    var stars = "";
    for (var i = 0; i < Math.floor(rating); i++) {
        stars += "<i class=\"fa fa-star\"></i>";
    }
    for (var i = Math.floor(rating); i < 5; i++) {
        stars += "<i class=\"fa fa-star-o\"></i>";
    }
    return stars;
};

module.exports.renderHomePage = function(req, res) {
    res.render('main/home', {
        title: title
    });
};

module.exports.renderLocatePage = function(req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: -122.2735941,
            lat: 37.8687595,
            maxDistance: 5
        }
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderLocations(req, res, body);
        }
    )
};

module.exports.renderLocationDetailsPage = function(req, res) {
    renderLocationDetails(req, res);
};