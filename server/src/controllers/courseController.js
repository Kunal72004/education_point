const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const courseModel = require("../models/courseModel");
const sectionModel = require("../models/sectionModel")
const subSectionModel = require("../models/subSectionModel")
const { isValid, isValidName } = require("../utils/validator");
const uploadToCloudinary = require("../utils/uploadCloudinary");
const courseProgressModel = require("../models/courseProgressModel");
const { convertSecondsToDuration } = require("../utils/secToDuration");

const createCourse = async (req, res) => {
  try {
    // Fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    const userId = req.user.id;

    // File (safe access)
    const thumbnail = req.files?.thumbnailImage;

    
    let tag = [];
    let instructions = [];
    let parsedWhatYouWillLearn = whatYouWillLearn;

    try {
      tag = _tag ? JSON.parse(_tag) : [];
    } catch {
      tag = [];
    }

    try {
      instructions = _instructions ? JSON.parse(_instructions) : [];
    } catch {
      instructions = [];
    }

    
    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !category ||
      !thumbnail ||
      tag.length === 0 ||
      instructions.length === 0 ||
      !parsedWhatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Default status
    if (!status) {
      status = "Draft";
    }

    //  Instructor check
    const instructorDetails = await userModel.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Category check
    const categoryDetails = await categoryModel.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    //  Upload thumbnail
    const thumbnailUpload = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //  Create course
    const newCourse = await courseModel.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: parsedWhatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailUpload.secure_url,
      status,
      instructions,
    });

    // Add course to instructor
    await userModel.findByIdAndUpdate(userId, {
      $push: { courses: newCourse._id },
    });

    // Add course to category
    await categoryModel.findByIdAndUpdate(category, {
      $push: { course: newCourse._id },
    });

    // Response
    return res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course created successfully",
    });

  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating course",
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
    if (!isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid course id" });
    }

    //get course
   const courseDetails = await courseModel.findOne({
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
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

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

    //return response
   const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
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
    const updates = { ...req.body };
    delete updates.courseId;
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
      try {
        course[key] = JSON.parse(updates[key]);
      } catch {
        course[key] = updates[key];
      }
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
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while editing Course",
    });
  }
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
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await courseProgressModel.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// Get a list of Course for a given Instructor
const getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    const instructorCourses = await courseModel
      .find({
        instructor: instructorId,
      })
      .sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

const deleteCourse = async (req,res)=>{
  try {
     const { courseId } = req.body
     // Find the course
    const course = await courseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    console.log(studentsEnrolled);
    for(const studentId of studentsEnrolled){
      await userModel.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await sectionModel.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await subSectionModel.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await sectionModel.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await courseModel.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
    
  } catch (error) {
     console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse
};
