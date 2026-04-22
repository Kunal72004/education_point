const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const courseModel = require("../models/courseModel");
const { isValid, isValidName } = require("../utils/validator");
const uploadToCloudinary = require("../utils/uploadCloudinary");
const courseProgressModel = require("../models/courseProgressModel");
const { convertSecondsToDuration } = require("../utils/secToDuration");

const createCourse = async (req, res) => {
  try {
    //data fetch
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;

    //get thumbnail
    let thumbnail = req.files.thumbnailImage;

    //validate data
    if (!isValid(courseName) || !isValidName(courseName)) {
      return res
        .status(400)
        .json({ success: false, msg: "Course Name is required or invalid" });
    }
    if (!isValid(courseDescription)) {
      return res
        .status(400)
        .json({ success: false, msg: "Course Name is required or invalid" });
    }
    if (!isValid(whatYouWillLearn)) {
      return res.status(400).json({
        success: false,
        msg: "What you will learn is required or invalid",
      });
    }

    if (!isValid(price) || price < 0) {
      return res
        .status(400)
        .json({ success: false, msg: "price is required or invalid price" });
    }
    if (!isValid(tag)) {
      return res
        .status(400)
        .json({ success: false, msg: "tag is required or invalid" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid category id " });
    }
    //get userId from storing data in request by decoding the token
    const userId = req.user.id;
    if (!isValid(userId)) {
      return res
        .status(401)
        .json({ success: false, msg: "invalid instructor id " });
    }

    //find instructor in db
    const instructorDetails = await userModel.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res
        .status(404)
        .json({ success: false, msg: "Instructor not found" });
    }

    if (instructorDetails.accountType !== "Instructor") {
      return res
        .status(403)
        .json({ success: false, msg: "only Instructor can create the course" });
    }

    // check tag is valid or not
    const categoryDetails = await categoryModel.findById(category);

    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, msg: "category is not found" });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME,
    );

    const newCourse = await courseModel.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag,
    });

    //add new course to the user schema to instructor
    await userModel.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    //add new course to th tag schema
    await categoryModel.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true },
    );

    // return res
    return res.status(201).json({
      success: true,
      msg: "New course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong while creating course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const allCourses = await courseModel
      .find(
        {},
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnrolled: true,
        },
      )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      msg: "Data for all course fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong while fetching all courses",
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    //get id
    let { courseId } = req.body;

    //validate
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid course id" });
    }

    //get course
    const courseDetails = await courseModel
      .findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({ success: false, msg: "course Not found" });
    }

    //return response
    return res.status(200).json({
      success: true,
      msg: "course detail fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while getting Course",
    });
  }
};

const editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await courseModel
      .findOne({
        _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {}
};

const getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await courseModel
      .findOne({
        _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    let courseProgressCount = await courseProgressModel.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount)
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })

  } catch (error) {

  }
};

// Get a list of Course for a given Instructor
const getInstructorCourses = async(req,res)=>{
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    const instructorCourses = await courseModel.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
  
}

module.exports = { createCourse, getAllCourses, getCourseDetails, editCourse, getFullCourseDetails,getInstructorCourses};
