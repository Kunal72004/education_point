const express = require("express")
const router = express.Router()
const { contactUs } = require("../controllers/contactUsController");

//contact route
router.post("/contact",contactUs);

module.exports = router