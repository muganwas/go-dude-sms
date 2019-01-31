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

function saveDetails(number, info){
    return new Promise ((resolve, reject) => {
        Details.findOneAndUpdate({phoneNumber: number}, info, {upsert: true}, function(err, detail){
            if(err){
                reject(err);
            }
            resolve("success");
        });
    });
}

function saveCode (info){
    return new Promise((resolve, reject)=>{
        var new_transaction = new Details(info);
        new_transaction.save(function(err, detail){
            if(err)
                reject(err);
            resolve("Info successfully saved");
        });
    })
}

exports.sendText = function (req, res){
    let oldFormat = req.query.number;
    let firstName = req.query.fname;
    let lastName = req.query.lname;
    let number = oldFormat.replace("0", "");
    let phoneNumber = "+33" + number;
    let from = "+" + process.env.TWILIO_FROM;
    let code = _random(5);
    let info = { firstName, lastName, phoneNumber, code }

    //update if the number already exists
    saveDetails(phoneNumber, info).then((response)=>{
        console.log(response);
        client.messages.create({
            body: 'Code: ' + code,
            from: from,
            to: phoneNumber
        }).then(function(message){
            res.json({"rand": message.sid, "code": code});
            console.log("SID: " + message.sid);
        }).catch((err)=>{
            res.json(err);
        }).done();
    }).catch((err)=>{
        console.log(err);
    });
}

exports.sendAlert = function (req, res){
    let oldFormat = req.query.number;
    let number = oldFormat.replace("0", "");
    let phoneNumber = "+33" + number;
    let link = req.query.link;
    let from = "+" + process.env.TWILIO_FROM;
    let message = 'Vous avez reçu une demande de réservation sur Godude, cliquez sur le lien ci-dessous pour visualiser la demande: ' + link;

    console.log(phoneNumber)

    client.messages.create({
        body: message,
        from: from,
        to: phoneNumber
    }).then(function(rez){
        res.json({"response": rez, "Sent Message": message });
        console.log("SID: " + rez.sid);
    }).catch((err)=>{
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
