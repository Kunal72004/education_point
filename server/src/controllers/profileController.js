const profileModel = require("../models/profileModel");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const courseProgressModel = require("../models/courseProgressModel");
const { isValid } = require("../utils/validator");
const uploadImageToCloudinary = require("../utils/uploadCloudinary");
const mongoose = require("mongoose");
const {convertSecondsToDuration} = require('../utils/secToDuration')

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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
    return res.status(200).json({
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

const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await userModel.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await profileModel.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await courseModel.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await userModel.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await courseProgressModel.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

const getUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //validation and get user details
    const userDetail = await userModel
      .findById(id)
      .populate("additionalDetails")
      .exec();

    //return res
    return res.status(200).json({
      success: true,
      msg: "User data fetched successfully",
      userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while getting the user details",
    });
  }
};

const updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000,
    );
    console.log(image);
    const updatedProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true },
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await userModel
      .findOne({
        _id: userId,
      })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0,
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds,
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await courseProgressModel.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier,
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await courseModel.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  updateProfile,
  deleteAccount,
  getUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
};
