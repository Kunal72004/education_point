const express = require('express');
const router = express.Router();
let {authentication,isStudent} = require('../middlewares/auth')

//import controller that required
const { capturePayment, verifyPayment,sendPaymentSuccessEmail } = require('../controllers/paymentController');

router.post("/capturePayment", authentication, isStudent, capturePayment);
router.post("/verifyPayment",authentication, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", authentication, isStudent, sendPaymentSuccessEmail);

//payment route
// router.post("/capturePayment",authentication,isStudent,capturePayment);
// router.post("/verifyPayment",authentication,isStudent,verifyPayment);

module.exports = router;