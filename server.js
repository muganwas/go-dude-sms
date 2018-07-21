require('dotenv').config();
var express = require('express'),
app = express(),
port = process.env.PORT || 4000,
cors = require('cors'),
mongoose = require('mongoose'),
Details = require('./api/models/transactionsDetailsModel'),
bodyParser = require('body-parser');
//mongo db connection string
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CON_URL, function(err){
    if(err)
        throw err;
    console.log("connected successfully");
});

app.use(bodyParser.urlencoded({extended: true}));
/** to avaoid problems with front end techs trying to access this resource */
app.use(cors());
/*automatically sends this
**************************
app.use(function(req, res){
    res.status(404).send({url: req.originalUrl + " Not Found"})
});
*/
app.use(bodyParser.json());

var routes = require('./api/routes/godudeRoutes');
routes(app);

app.listen(port);

console.log("goDude RESTful API server started at " + port);