const express = require('express');
const router = express.Router();

//import controller that required
const {login, signUp, sendOtp, changePassword} = require('../controllers/authController');
const { authentication } = require('../middlewares/auth');
const { resetPasswordToken, resetPassword } = require('../controllers/resetController');

//authentication route

//route for user login
router.post("/login",login)
//route for user signUp
router.post("/signup",signUp);
//route for send otp to the user email
router.post("/sendotp",sendOtp);
//router for change password
router.post("/changePassword",authentication,changePassword);


//reset password route

//route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken);

//route for reseting password after verification
router.post("/resetPassword",resetPassword);

module.exports = router;