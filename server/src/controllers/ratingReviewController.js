const ratingReviewModel = require("../models/ratingAndReviewModel");
const courseModel = require("../models/courseModel");
const mongoose = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rating, review, courseId } = req.body;

    // Check enrollment
    const courseDetails = await courseModel.findOne({
      _id: courseId,
      studentsEnrolled: userId,
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        msg: "Student is not enrolled in the course",
      });
    }

    // Check already reviewed
    const alreadyReviewed = await ratingReviewModel.findOne({
      user: userId,
      course: courseId,
    });

    // console.log("alreadyReviewed :", alreadyReviewed);

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user",
      });
    }

    // Create review
    const ratingReview = await ratingReviewModel.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update course
    await courseModel.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong while creating review",
    });
  }
};

//get avg rating
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;

    //calculate average rating
    const result = await ratingReviewModel.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //return ratiing
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        msg: "feteched average rating successfully",
        averageRating: result[0].averageRating,
      });
    }

    //if no review and rating exist
    return res.status(200).json({
      success: true,
      msg: "Average rating is 0, no rating given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while fetching average rating",
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await ratingReviewModel
      .find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        selecta: "courseName",
      })
      .exec();

    return res
      .status(200)
      .json({
        success: true,
        msg: "All review fetch successfully",
        data: allReviews,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while fetching all review",
    });
  }
};
