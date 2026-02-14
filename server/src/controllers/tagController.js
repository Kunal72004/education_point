const tagModel = require('../models/tagModel');
const {isValid, isValidName} = require('../utils/validator')
const creatTag = async(req,res)=>{
    try {
        // data fetch req body
        let {name,description} = req.body;
        
        //validate data 
        if(!isValid(name) || !isValidName(name)){
            return res.status(400).json({success:false,msg:"Name is required or invalid"});
        }

        if(!isValid(description)){
            return res.status(400).json({success:false,msg:"Name is required or invalid"});
        }

        const createTag = await tagModel.create({name,description});
        return res.status(201).json({success:true,msg:"Tag created successfully",createTag});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while creating tag"});
    }
}

const getAllTags = async(req,res)=>{
    try {
        const allTag = await tagModel.find({},{name:true,description:true});
        return res.status(200).json({success:true,msg:"getting all successfully",allTag});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while geting all tag"});
    }
}

module.exports = {creatTag,getAllTags}