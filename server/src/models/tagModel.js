const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trime:true,
    },
    course:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
        }
    ]

},{timestamps:true})

module.exports = mongoose.model("Tag",tagSchema);