const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*5
    }
})

module.exports = mongoose.model("Otp",otpSchema);