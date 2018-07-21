var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TransactionDetailsSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    code: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Details', TransactionDetailsSchema);