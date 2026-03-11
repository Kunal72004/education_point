const express = require('express');
const router = express.Router();

//import controller that required
let {deleteAccount,updateProfile,getUserDetails, getEnrolledCourses, updateDisplayPicture, instructorDashboard} = require("../controllers/profileController");
let {authentication, isInstructor} = require('../middlewares/auth')

//profile route
router.delete("/deleteProfile",authentication,deleteAccount);
router.get("/getUserDetails",authentication,getUserDetails);
router.put("/updateProfile",authentication,updateProfile);

//get enrolled courses
router.get('/getEnrolledCourses',authentication,getEnrolledCourses);
router.put("/updateDisplayPicture", authentication, updateDisplayPicture)
router.get("/instructorDashboard", authentication, isInstructor, instructorDashboard)

module.exports = router;