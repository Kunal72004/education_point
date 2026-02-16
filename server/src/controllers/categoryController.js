const categoryModel = require('../models/categoryModel');
const {isValid, isValidName} = require('../utils/validator')

const createCategory = async(req,res)=>{
    try {
        // data fetch req body
        let {name,description} = req.body;
        
        //validate data 
        if(!isValid(name) || !isValidName(name)){
            return res.status(400).json({success:false,msg:"Name is required or invalid"});
        }

        if(!isValid(description)){
            return res.status(400).json({success:false,msg:"description is required or invalid"});
        }

        const newCategory = await categoryModel.create({name,description});
        return res.status(201).json({success:true,msg:"Tag created successfully",newCategory});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while creating tag"});
    }
}

const getAllCategory = async(req,res)=>{
    try {
        const allCategory = await categoryModel.find({},{name:true,description:true});
        return res.status(200).json({success:true,msg:"getting all successfully",allCategory});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,msg:"something went wrong while geting all tag"});
    }
}

module.exports = {createCategory,getAllCategory}