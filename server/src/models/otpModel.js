const mongoose = require('mongoose');
const sendMail = require('../utils/sendMail');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');
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

async function sendEmailVerification(email,otp){
    try {
        let response = await sendMail(email,"Verification Email",emailTemplate(otp));
        console.log("email sent successfully",response);;
    } catch (error) {
        console.log("Error occured while sending mail",error);
        throw error;        
    }
    
}

otpSchema.pre("save",async function(next){
    await sendEmailVerification(this.email,this.otp);
    next();
})

module.exports = mongoose.model("Otp",otpSchema);