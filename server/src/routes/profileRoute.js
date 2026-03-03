const express = require('express');
const router = express.Router();

//import controller that required
let {deletAccount,updateProfile,getUserDetails} = require("../controllers/profileController");
let {authentication} = require('../middlewares/auth')

//profile route
router.delete("/deleteProfile",authentication,deletAccount);
router.get("/getUserDetails",authentication,getUserDetails);
router.put("/updateProfile",authentication,updateProfile);

//get enrolled courses

module.exports = router;