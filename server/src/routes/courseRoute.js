const express = require("express");
const router = express.Router();

//import controller that required

const {
  authentication,
  isInstructor,
  isAdmin,
  isStudent,
} = require("../middlewares/auth");
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getFullCourseDetails,
  getInstructorCourses,
} = require("../controllers/courseController");
const {
  addSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const {
  addSubsection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSectionController");
const {
  createCategory,
  getAllCategory,
  categoryPageDetails,
} = require("../controllers/categoryController");
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/ratingReviewController");

//course Route

//course created (only Instructor)
router.post("/createCourse", authentication, isInstructor, createCourse);

//add section to course
router.post("/addSection", authentication, isInstructor, addSection);
//update section
router.put("/updateSection", authentication, isInstructor, updateSection);
//delete section
router.delete("/deleteSection", authentication, isInstructor, deleteSection);

//add subSection
router.post("/addSubSection", authentication, isInstructor, addSubsection);
//update subSection
router.put("/updateSubSection", authentication, isInstructor, updateSubSection);
//delete deleteSubSection
router.delete("/deleteSubSection", authentication, isInstructor, deleteSubSection);

//get all registered course
router.get("/getAllCourse", getAllCourses);
//get details for specific course
router.post("/getCourseDetails", getCourseDetails);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", authentication, getFullCourseDetails)
// Edit Course routes
router.put("/editCourse", authentication, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", authentication, isInstructor, getInstructorCourses)

//category Routes

router.post("/createCategory", authentication, isAdmin, createCategory);
router.get("/showAllCategories", getAllCategory);
router.post("/categoryPageDetails", categoryPageDetails);

//rating and reviews

router.post("/createRating", authentication, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
