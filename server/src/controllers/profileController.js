const profileModel = require("../models/profileModel");
const userModel = require("../models/userModel");
const { isValid } = require("../utils/validator");
const mongoose = require("mongoose");

const updateProfile = async (req, res) => {
  try {
    //get data
    let { gender, dateOfBirth, about, contactNumber } = req.body;

    //get user id
    let userId = req.user.id;

    //validation
    if (!isValid(gender)) {
      return res
        .status(400)
        .json({ success: false, msg: "gender is required or invalid" });
    }
    if (!isValid(dateOfBirth)) {
      return res
        .status(400)
        .json({ success: false, msg: "DOB is required or invalid" });
    }
    if (!isValid(about)) {
      return res
        .status(400)
        .json({ success: false, msg: "about is required or invalid" });
    }
    if (!isValid(contactNumber)) {
      return res
        .status(400)
        .json({ success: false, msg: "contact number is required or invalid" });
    }
    if (!mongoose.Schema.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, msg: "invalid user id" });
    }

    //find profile using  user user model
    const userDetails = await userModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const profileDetails = await profileModel.findById(
      userDetails.additionalDetails,
    );
    if (!profileDetails) {
      return res
        .status(404)
        .json({ success: false, msg: "profile is not  exist with this id" });
    }

    //update profile
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    //return res
    return res
      .status(200)
      .json({
        success: true,
        msg: "Profile updated successfully",
        data: profileDetails,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while updating the profile",
    });
  }
};

const deletAccount = async(req,res)=>{
    try {
        //get id 
        let userId = req.user.id;

        //validate 
        if(!mongoose.Schema.Types.ObjectId.isValid(userId)){
            return res.status(400).json({success:false,msg:"invalid user id"})
        }
        const userDetail = await userModel.findById(userId);
        if(!userDetail){
            return res.status(404).json({success:false,msg:"user not found"});
        }
        //delete prodile and user
        await profileModel.findByIdAndDelete(userDetail.additionalDetails);
        await userModel.findByIdAndDelete(userId);


        //return res
        return res.status(200).json({success:true,msg:"user deleted successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while, deleting the account."})
    }
}

const getProfile = async(req,res)=>{
    try {
        //get id
        const id = req.user.id;

        //validation and get user details
        const userDetail = await userModel.findById(id).populate("additionalDetails").exec();

        //return res
        return res.status(200).json({success:true,msg:"User data fetched successfully",userDetail});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong, while getting the user details"});
    }
}

module.exports = { updateProfile,deletAccount ,getProfile};
