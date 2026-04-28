const mongoose = require("mongoose");
const courseModel = require("../models/courseModel");
const sectionModel = require("../models/sectionModel");
const subSectionModel = require("../models/subSectionModel");
const { isValid } = require("../utils/validator");

const addSection = async (req, res) => {
  try {
    //data fetch
    let { sectionName, courseId } = req.body;

    //data validation
    if (!isValid(sectionName)) {
      return res
        .status(400)
        .json({ success: false, msg: "section name is required" });
    }
    if (!isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid course Id" });
    }

    //create section
    const newSection = await sectionModel.create({ sectionName });

    //update course with section objectId
    const updatedCourseDetail = await courseModel
      .findByIdAndUpdate(
        courseId,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true },
      )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });
    //return response
    return res.status(201).json({
      success: true,
      message: "Section added successfully",
      data: updatedCourseDetail,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong ,while adding section",
        error: error.message,
      });
  }
};

const updateSection = async (req, res) => {
  try {
    //data fetch
    let { sectionName, sectionId, courseId } = req.body;

    //data validation
    if (!isValid(sectionName)) {
      return res
        .status(400)
        .json({ success: false, msg: "section Name is required or invalid" });
    }

    if (!isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid section id" });
    }

    if (!isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid course id" });
    }
    //update data
    const section = await sectionModel.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true },
    );

    const course = await courseModel.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // return res
    return res
      .status(201)
      .json({
        success: true,
        msg: "section updated successfully",
        data: course,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong, while updating the section",
      });
  }
};

const deleteSection = async (req, res) => {
  try {
    //get id
    let { sectionId, courseId } = req.body;

    //validate section id
    if (!isValid(sectionId)) {
      return res
        .status(400)
        .json({ succes: false, msg: "section Id is not valid" });
    }

    //validate section id
    if (!isValid(courseId)) {
      return res
        .status(400)
        .json({ succes: false, msg: "course Id is not valid" });
    }

    // console.log("1");

    // console.log("2");

    // console.log("sectionId : ", sectionId);
    const section = await sectionModel.findById(sectionId);
    console.log("section : ", section);

    // console.log("3");

    if (!section) {
      return res.status(404).json({
        success: false,
        msg: "Section not Found",
      });
    }

    // console.log("4");

    //delete subsection
    await subSectionModel.deleteMany({ _id: { $in: section.subSection } });
    await sectionModel.findByIdAndDelete(sectionId);

    await courseModel.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // console.log("5");

    //find the updated course and return
    const course = await courseModel
      .findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // console.log(course);
    // console.log("6");

    res.status(200).json({
      success: true,
      msg: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong , while deleting section",
      });
  }
};

const getSection = async (req, res) => {
  try {
    //get id
    let { sectionId } = req.params;

    //validate
    if (!mongoose.Schema.Types.ObjectId.isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid section id" });
    }

    //get section
    const section = await sectionModel.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, msg: "section is not found " });
    }
    //return res
    return res
      .status(200)
      .json({ success: true, msg: "fetched section successfully", section });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong, while getting the section",
      });
  }
};

module.exports = { addSection, updateSection, deleteSection, getSection };
