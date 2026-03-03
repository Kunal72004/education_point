const express = require("express")
const { contactUsController } = require("../controllers/contactController")
const router = express.Router()

//constact route
router.post("/contact",contactUsController);

module.exports = router