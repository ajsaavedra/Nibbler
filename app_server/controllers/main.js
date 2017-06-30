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

const renderReviewForm = function(req, res, locationDetail) {
    res.render('main/review-form', {
        title: title,
        location: locationDetail
    });
};

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

const getLocationInfo = function(req, res, callback) {
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
            if (response.statusCode === 200) {
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);   
            } else {
                console.log("Error getting location: " + response.statusCode);
            }
        }
    );
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
    getLocationInfo(req, res, function(req, res, responseData) {
        renderLocationDetails(req, res, responseData);
    });
};

module.exports.renderReviewFormPage = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};

module.exports.addUserReview = function(req, res) {
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = '/api/locations/' + locationid + '/reviews';
    postdata = {
        author: 'Tester',
        rating: parseInt(req.body.reviewRating, 10),
        reviewText: req.body.reviewText
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        json: postdata
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/locate/' + locationid);
            } else {
                console.log("Error adding review" + response.statusCode);
            }
        }
    );
};