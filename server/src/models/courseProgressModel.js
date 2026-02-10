const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    couseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVedios:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }
    ]
},{timestamps:true})

module.exports = mongoose.model("CourseProgress",courseProgressSchema);