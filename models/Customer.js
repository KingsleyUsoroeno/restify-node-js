const mongoose = require('mongoose');
const timeStamp = require('mongoose-timestamp');

const CustomerSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        trim: true
    },

    balance:{
        type: Number,
        default:0
    },
});

CustomerSchema.plugin(timeStamp);
const Customer = mongoose.model("Customer", CustomerSchema)
module.exports = Customer