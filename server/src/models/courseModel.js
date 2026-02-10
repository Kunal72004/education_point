const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName :{
        type:String,
        trim:true,
        required:true,
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number,
        trim:true,
        required:true
    },
    thumbnail:{
        type:String,
        trim:true
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    ]

},{timestamps:true})

module.exports = mongoose.model("Course",courseSchema);