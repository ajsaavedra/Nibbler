const router = require('express').Router();
const location = require('../../app_api/models/locations');

router.get('/', function(req, res) {
    res.render('main/home');
});

router.get('/locate', function(req, res) {
    res.render('main/locate');
});

module.exports = router;