const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const profileModel = require("../models/profileModel");
const {
  isValid,
  isValidEmail,
  isValidName,
  isValidPassword,
} = require("../utils/validator");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const sendMail = require("../utils/sendMail");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// send otp
// Send OTP For Email Verification
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await userModel.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await otpModel.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    // console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await otpModel.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message ,msg:"internal server error" })
  }
}
// signup
const signUp = async (req, res) => {
  try {
    //request data from req body
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;
    //validate
    if (!isValid(firstName) || !isValidName(firstName)) {
      return res
        .status(400)
        .json({ success: false, msg: "first name is required or invalid" });
    }

    if (!isValid(lastName) || !isValidName(lastName)) {
      return res
        .status(400)
        .json({ success: false, msg: "last name is required or invalid" });
    }

    if (!isValid(email) || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "email is required or invalid" });
    }

    if(!password || !confirmPassword){
      return res.status(400).json({success:false, msg:"password and confirm password field is required"})
    }

    if (!isValid(accountType)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid account Type" });
    }

    //check 2 password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "password and confirmPassword is not match",
      });
    }
    //check user already exist or not
    let userExist = await userModel.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ success: false, msg: "user already register" });
    }

    //find most recent otp stored in db
    const recentOtp = await otpModel
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // console.log(recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      return res.status(404).json({ success: false, msg: "otp not found" });
    }

    // console.log(`enter otp : ${otp}`,`recent otp : ${recentOtp[0].otp}` );
   
    if (otp !== recentOtp[0].otp) {
      return res
        .status(400)
        .json({ success: false, msg: "Enter otp is not correct" });
    }
    //hash password
    let hashPassword = await bcrypt.hash(password, 10);

    const profile = await profileModel.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    console.log(profile);
    console.log(profile._id);
    
    console.log(accountType);
    
    
    //signup entry create in db
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      confirmPassword,
      additionalDetails:profile._id,
      accountType,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // send response
    return res
      .status(201)
      .json({ success: true, msg: "user signUp successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "user cannot be registered, please try again letter",
    });
  }
};

// login
const login = async (req, res) => {
  try {
    //data fetch for req body
    let { email, password } = req.body;

    //validate data
    if (!isValid(email) || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "email is required or invalid" });
    }

    //check user exist or not
    const user = await userModel
      .findOne({ email })
      .select("+password")
      .populate("additionalDetails");
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    //check password match and generate jwt token
    console.log(user.password);
    
    if (await bcrypt.compare(password, user.password)) {
      let payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;

      //creat cookie and send response
      let options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res
        .cookie("token", token, options)
        .status(200)
        .json({ success: true, msg: "user login successfully", user, token });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Wrong password entered" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "error in Login" });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    //get data
    let { oldPassword, newPassword } = req.body;
    let userId = req.user.id;

    //validate
    if (!mongoose.Schema.Types.ObjectId.isValid(userId)){
      return res.status(400).json({success:false,msg:"invalid user id"});
    }
    if (!oldPassword || !oldPassword) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }
    if (newPassword || newPassword){
      return res
        .status(400)
        .json({ success: false, msg: "Invalid newPassword" });
    }

    //get user
    const userDetaitl = await userModel.findById(userId);

    //validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetaitl.password,
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ succes: false, msg: "password is incorrect" });
    }

    //update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetail = await userModel.findByIdAndUpdate(
      userId,
      { password: encryptedPassword },
      { new: true },
    );

    //send email
    try {
      const emailResponse = await sendMail(
        userDetaitl.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetail.email,
          `Password updated successfully for ${updatedUserDetail.firstName} ${updatedUserDetail.lastName}`,
        ),
      );
      console.log("Email send successfully: ", emailResponse.response);
    } catch (error) {
      // if there's an error sending the email, log the error and return a error
      console.log("error occured while sending the sending eamil", error);
      return res
        .status(500)
        .json({ success: false, msg: "error occured while sending email" });
    }

    //return success response
    return res.status(200).json({success:true,msg:"password updated successfully"})
  } catch (error) {
// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
};

module.exports = { sendOtp, signUp, login, changePassword };
