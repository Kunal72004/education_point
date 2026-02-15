const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const tagModel = require('../models/tagModel');
const courseModel = require('../models/courseModel');
const uploadImage = require('../utils/uploadImage');
const {isValid, isValidName} = require('../utils/validator');
const { default: mongoose } = require('mongoose');
const uploadImage = require('../utils/uploadImage');

const createCourse = async(req,res)=>{
    try {
        //data fetch
        let {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;

        //get thumbnail
        let thumbnail = req.files.thumbnailImage;

        //validate data
        if(!isValid(courseName) || !isValidName(courseName)){
            return res.status(400).json({success:false,msg:"Course Name is required or invalid"});
        }
        if(!isValid(courseDescription)){
            return res.status(400).json({success:false,msg:"Course Name is required or invalid"});
        }
         if(!isValid(whatYouWillLearn)){
            return res.status(400).json({success:false,msg:"What you will learn is required or invalid"});
        }

        if(!isValid(price) && typeof price !== 'number' && price<0){
            return res.status(400).json({success:false,msg:"price is required or invalid price"})
        }
        if(!mongoose.Schema.Types.ObjectId.isValid(tag)){
            return res.status(400).json({success:false,msg:"Invalid tag id "});
        }
        //get userId from storing data in request by decoding the token
        const userId = req.user.id;
        if(!mongoose.Schema.Types.ObjectId.isValid(userId)){
            return res.status(401).json({success:false,msg:"invalid instructor id "})
        }

        //find instructor in db
        const instructorDetails = await userModel.findById(userId);
        console.log(instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({success:false, msg:"Instructor not found"})
        }
        
        if(instructorDetails.accountType !== "Instructor"){
            return res.status(403).json({success:false ,msg : "only Instructor can create the course"})
        }

        // check tag is valid or not 
        const tagDetails = await tagModel.findById(tag);

        if(!tagDetails){
            return res.status(404).json({success:false, msg:"tag is not found"});
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImage(thumbnail,process.env.FOLDER_NAME);

        const newCourse = await courseModel.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add new course to the user schema to instructor
        await userModel.findByIdAndUpdate({_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        );
        
        //add new course to th tag schema
         await tagModel.findByIdAndUpdate({_id:tagDetails._id},
            {
                $push:{
                    course:newCourse._id
                }
            },
            {new:true}
        );

        // return res
        return res.status(201).json({success:true,msg:"New course created successfully",data:newCourse})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while creating course"});
        
    }
}


module.exports = {createCourse};