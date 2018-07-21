'use strict';
module.exports = function(app){
    var details = require('../controllers/detailsController');

    //details routes
    app.route('/api/v1/sendText')
        .get(details.sendText);

}