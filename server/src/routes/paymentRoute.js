const express = require('express');
const router = express.Router();

//import controller that required
let {authentication, isStudent} = require('../middlewares/auth');
const { capturePayment, verifyPayment } = require('../controllers/paymentController');

//payment route
router.post("/capturePayment",authentication,isStudent,capturePayment);
router.post("/verifyPayment",authentication,isStudent,verifyPayment);

module.exports = router;