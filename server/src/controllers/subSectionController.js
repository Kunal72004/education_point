const subSectionModel = require("../models/subSectionModel");
const sectionModel = require("../models/sectionModel");
const mongoose = require("mongoose");
const { isValid } = require("../utils/validator");
const uploadToCloudinary = require("../utils/uploadCloudinary");

const addSubsection = async (req, res) => {
  try {
    //fetch data from req body
    let { sectionId, title, description } = req.body;
    let video = req.files.video;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }
    console.log(video);
    //uploading video to cloudinary
    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME,
    );

    //create subsection
    const subSectionDetails = await subSectionModel.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with this sub section objectId
    const updatedSection = await sectionModel
      .findByIdAndUpdate(
        sectionId,
        {
          $push: {
            subSection: subSectionDetails._id,
          },
        },
        { new: true },
      )
      .populate("subSection")
      .exec();

    console.log(updatedSection);

    //return res
    return res.status(201).json({
      success: true,
      msg: "sub section created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while creating sub Section",
    });
  }
};

const updateSubSection = async (req, res) => {
  try {
    //fetch data
    let { sectionId, subSectionId, title, description } = req.body;

    const subSection = await subSectionModel.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files?.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FOLDER_NAME,
      );

      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await sectionModel
      .findById(sectionId)
      .populate("subSection");

    console.log("updated section", updatedSection);

    return res.status(200).json({
      success: true,
      msg: "SubSection updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while updating sub Section",
    });
  }
};

const deleteSubSection = async (req, res) => {
  try {
   const { subSectionId, sectionId } = req.body
    await sectionModel.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )

    const subSection = await subSectionModel.findByIdAndDelete({ _id: subSectionId })

     if (!subSection) {
      return res
        .status(404)
        .json({ success: false, msg: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await sectionModel.findById(sectionId).populate(
      "subSection"
    )
    return res.status(200).json({
      success: true,
      msg: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while deleting sub Section",
    });
  }
};

const getSubSection = async (req, res) => {
  try {
    //get id
    let { subSectionId } = req.params;

    //validate
    if (!mongoose.Schema.Types.ObjectId.isValid(subSectionId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid sub section id" });
    }

    //get sub section
    const subSection = await subSectionModel
      .findById(subSectionId)
      .populate({ path: "" });
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, msg: "sub section is not found " });
    }
    //return res
    return res.status(200).json({
      success: true,
      msg: "fetched sub section successfully",
      subSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while getting sub section",
    });
  }
};

module.exports = {
  addSubsection,
  updateSubSection,
  deleteSubSection,
  getSubSection,
};
