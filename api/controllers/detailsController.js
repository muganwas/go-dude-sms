'use strict';

var mongoose = require('mongoose'),
accountSid = process.env.TWILIO_UID,
authToken = process.env.TWILIO_AUTH_TOKEN,
twilio = require('twilio'),
client = new twilio(accountSid, authToken),
Details = mongoose.model('Details'),
crypto = require('crypto');

function _random (howMany){
    var chars = "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = Math.min(256, chars.length)
        , d = 256 / len

    for (var i = 0; i < howMany; i++) {
        value[i] = chars[Math.floor(rnd[i] / d)]
    };

    return value.join('');
}

function saveCode (info){
    var new_transaction = new Details(info);
    new_transaction.save(function(err, detail){
        if(err)
            return err;
        return "Info successfully saved";
    });
}

exports.sendText = function (req, res){
    let oldFormat = req.query.number;
    let firstName = req.query.fname;
    let lastName = req.query.lname;
    let number = oldFormat.replace("0", "");
    let phoneNumber = "+33" + number;
    let from = '+33644641136';
    let code = _random(5);
    let info = { firstName, lastName, phoneNumber, code }
    let saved = saveCode(info);
    console.log(saved);
    //res.json({"rand ": message});
    client.messages.create({
            body: 'Code: ' + code,
            from: from,
            to: phoneNumber
       }).then(function(message){
            res.json({"rand": message.sid, "code": code});
            console.log("SID: " + message.sid)
        }).catch((err)=>{
            //throw err;
            res.json(err);
        }).done();
}

exports.getToken = function (req, res){
    let oldFormat = req.query.number;
    let number = oldFormat.replace("0", "");
    let phoneNumber = "+33" + number;
    Details.findOne({phoneNumber:phoneNumber}, function(err, detail){
        if(err)
            res.send(err)
        res.json(detail);
    });
}
