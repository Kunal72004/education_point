const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    gender:{
        type:String,
        trim:true
    },
    dateOfBirth:{
        type:String,
        trim:true,
    },
    about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true
    }

})

module.exports = mongoose.model("Profile",ProfileSchema);




// Define the Profile schema
// const profileSchema = new mongoose.Schema({
// 	gender: {
// 		type: String,
// 	},
// 	dateOfBirth: {
// 		type: String,
// 	},
// 	about: {
// 		type: String,
// 		trim: true,
// 	},
// 	contactNumber: {
// 		type: Number,
// 		trim: true,
// 	},
// });
