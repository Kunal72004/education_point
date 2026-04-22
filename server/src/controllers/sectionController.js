const mongoose = require("mongoose");
const courseModel = require("../models/courseModel");
const sectionModel = require("../models/sectionModel");
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
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid course Id" });
    }

    //create section
    const newSection = await sectionModel.create({ sectionName });

    //update course with section objectId
    const updatedCourseDetail = await courseModel.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true },
    ).populate({
        path:"courseContent",
        populate:{
            path:"subSection",
        }
    });
    //return response
    return res.status(201).json({
        success:true,
        message:"Section added successfully",
        data:updatedCourseDetail
    })
  } catch (error) {
    return res.status(500).json({success:false,msg:"something went wrong ,while adding section",error:error.message});
  }
};


const updateSection = async(req,res)=>{
    try {
        //data fetch
        let {sectionName,sectionId} = req.body;

        //data validation
        if(!isValid(sectionName)){
            return res.status(400).json({success:false, msg:"section Name is required or invalid"});
        }

        if(!isValid(sectionId)){
            return res.status(400).json({success:false , msg:"Invalid section id"});
        }
        //update data
        const section = await sectionModel.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        // return res
        return res.status(201).json({success:true,msg:"section updated successfully",section});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong, while updating the section"});
        
    }
}

const deleteSection = async(req,res)=>{
    try {
        //get id
        let {sectionId} = req.body;

        //validate section id
        if(!mongoose.Types.ObjectId.isValid(sectionId));

        // use findByid and delete
        await sectionModel.findByIdAndDelete(sectionId);

        // return response
        return res.status(200).json({success:true,msg:"section deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong , while deleting section"});
    }
}

const getSection = async(req,res)=>{
  try {
    //get id 
    let {sectionId} = req.params;

    //validate
    if(!mongoose.Schema.Types.ObjectId.isValid(sectionId)){
      return res.status(400).json({success:false,msg:"Invalid section id"});
    }

    //get section
    const section = await sectionModel.findById(sectionId);
    if(!section){
      return res.status(404).json({success:false,msg:"section is not found "});
    }
    //return res
    return res.status(200).json({success:true,msg:"fetched section successfully",section});
  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,msg:"something went wrong, while getting the section"})
    
  }
}

module.exports = { addSection,updateSection ,deleteSection,getSection};
