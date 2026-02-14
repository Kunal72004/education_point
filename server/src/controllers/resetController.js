const userModel = require("../models/userModel");
const sendMail = require("../utils/sendMail");
const { isValid, isValidEmail, isValidPassword } = require("../utils/validator");
const bcrypt = require('bcrypt')
// reset token (send mail)
const resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    let { email } = req.body;

    //validate email
    if (!isValid(email) || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "eamil is required or invalid" });
    }

    //check if user exist or not
    let user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "user not registered" });
    }

    //generate token
    let token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await userModel.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpires: Date.now(3 * 60 * 1000) },
      { new: true },
    );

    //create url
    let url = `http://localhost:3000/update-password/${token}`;

    //send mail containing url
    await sendMail(
      email,
      "Password Reset Link",
      `Click here to reset your password : ${url}`,
    );

    //return res
    return res
      .status(200)
      .json({ success: true, msg: "user email sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong while sending reset password email",
      });
  }
};

// reset password
const resetPassword = async(req,res)=>{
    try {
      //data fetch 
      let {password,confirmPassword,token} = req.body;

      //validate data
      if(!isValid(password) || !isValidPassword(password)){
        return res.status(400).json({success:false,msg:"Password is required or invalid"});
      }
      if(!isValid(confirmPassword) || !isValidPassword(confirmPassword)){
        return res.status(400).json({success:false,msg:"confirm password is required or invalid"});
      }

      if(!isValid(token)){
        return res.status(400).json({success:false, msg:"invalid token"})
      }

      //check password or confirm password match or not 
      if(password !== confirmPassword){
        return res.status(400).json({
          success:false,
          msg:"password or confirm password is not match"
        })
      }

      //get user form db using token
      const userDetails = await userModel.findOne({token:token});
      if(!userDetails){
        return res.status(404).json({success:false, msg:"invalid token"})
      }
      if(userDetails.resetPasswordExpires < Date.now()){
        return res.status(400).json({success:false,msg:"Token is expired, please regenerate your token"});
      }

      //hash password
      const hashPassword = await bcrypt.hash(password,10);
      
      //update new hash password in db
      let updatePasswordUser = await userModel.findOneAndUpdate({token:token},{password:hashPassword},{new:true});

      //send res
      return res.status(200).json({success:true,msg:"password reset successfully"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong ,while reseting password"});
        
    }
}

module.exports = {resetPasswordToken,resetPassword};