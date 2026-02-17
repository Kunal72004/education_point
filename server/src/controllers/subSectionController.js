const subSectionModel = require("../models/subSectionModel");
const sectionModel = require("../models/sectionModel");
const mongoose = require("mongoose");
const { isValid } = require("../utils/validator");
const uploadToCloudinary = require("../utils/uploadCloudinary");

const createSubsection = async (req, res) => {
  try {
    //fetch data from req body
    let { sectionId, title, timeDuration, description } = req.body;
    let video = req.files.videoFile;

    //validate data
    if (!mongoose.Schema.Types.ObjectId.isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid section id" });
    }
    if (!isValid(title)) {
      return res
        .status(400)
        .json({ success: false, msg: "title is required or invalid" });
    }
    if (!isValid(timeDuration)) {
      return res
        .status(400)
        .json({ success: false, msg: "time duration is required or invalid" });
    }
    if (!isValid(description)) {
      return res
        .status(400)
        .json({ success: false, msg: "description is required or invalid" });
    }

    if (!video) {
      return res
        .status(400)
        .json({ success: false, msg: "vedio File is required " });
    }

    //uploading video to cloudinary
    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME,
    );

    //create subsection
    const subSectionDetails = await subSectionModel.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with this sub section objectId
    const updatedSection = await sectionModel.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true },
    ).populate("subSection").exec();

    console.log(updatedSection);
    
    //return res
    return res.status(201).json({success:true,msg:"sub section created successfully",updatedSection});


  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,msg:"something went wrong, while creating sub Section"});
  }
};

const updateSection = async(req,res)=>{
    try {
        //fetch data 
        let { subSectionId, title, timeDuration, description } = req.body;
        let video = req.files.videoFile;
        
        //make object of updated field 
        let updatedData = {};

        if(!mongoose.Schema.Types.ObjectId.isValid(subSectionId)){
          return res.status(400).json({success:false,msg:"Invalid sub Section id"});
        }

        if(isValid(title)){
          updatedData.title = title;
        }
        if(isValid(timeDuration)){
          updatedData.timeDuration = timeDuration;
        }
        if(isValid(description)){
          updatedData.description = description;
        }

        if(video){
          let updatedUpload = await uploadToCloudinary(video,process.env.FOLDER_NAME);
          if(updatedUpload){
            updatedData.videoUrl = updatedUpload.secure_url;
          }
        }

        const updatedSubSection = await subSectionModel.findByIdAndUpdate(subSectionId,updatedData,{new:true});
        if(!updatedSubSection){
          return res.status(404).json({success:false, msg:"Subsection is not exist with this subsection id"});
        }


        return res.status(200).json({success:true,msg:"sub section updated successfully"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong, while updating sub Section"});
    }
}

const deleteSection = async(req,res)=>{
    try {
        //get id of subsection
        let {subSectionId} = req.params;

        //validate id
        if(!mongoose.Schema.Types.ObjectId.isValid(subSectionId)){
          return res.status(400).json({success:false, msg:"Invalid sub section id"})
        }

        //delete subsection
        const deletedSubsection = await subSectionModel.findOneAndDelete(subSectionId);
        if(!deletedSubsection){
          return res.status(404).json({success:false ,msg:"sub section is not found with this id"});
        }
        //return response
        return res.status(200).json({success:true, msg:"sub section deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong, while deleting sub Section"});
    }
}

const getSubSection = async(req,res)=>{
  try {
     //get id 
        let {subSectionId} = req.params;
    
        //validate
        if(!mongoose.Schema.Types.ObjectId.isValid(subSectionId)){
          return res.status(400).json({success:false,msg:"Invalid sub section id"});
        }
    
        //get sub section
        const subSection = await subSectionModel.findById(subSectionId).populate({path:""});
        if(!subSection){
          return res.status(404).json({success:false,msg:"sub section is not found "});
        }
        //return res
        return res.status(200).json({success:true,msg:"fetched sub section successfully",subSection});

  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,msg:"something went wrong, while getting sub section"});
    
  }
}
module.exports = { createSubsection,updateSection,deleteSection ,getSubSection};
