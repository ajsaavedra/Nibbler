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

const renderLocationDetails = function(req, res, locationDetail) {
    res.render('main/location-info', {
        title: locationDetail.name,
        location: locationDetail,
        starRating: starRating,
        formatDate: formatDate
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

const formatDate = function(date) {
    var str, formattedDate;
    formattedDate = new Date(date);
    str = getMonthString(formattedDate.getMonth()) + " " +
          formattedDate.getDay() + ", " +
          formattedDate.getFullYear();
    return str;
};

const getMonthString = function(month) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month-1];
}

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
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            renderLocationDetails(req, res, data);
        }
    );
};
