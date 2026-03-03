const { instance } = require("../config/razorpay");
const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const sendMail = require("../utils/sendMail");
const {
  courseEnrollmentEmail
} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");

//create order
exports.capturePayment = async (req, res) => {
  try {
    //get courseId and userId
    let { course_id } = req.body;
    let userId = req.user.id;
    //validation
    //validation CourseId
    if (!mongoose.Schema.Types.ObjectId(course_id)) {
      return res.status(400).json({ success: false, msg: "Invalid course_id" });
    }

    //validetion courseDetail
    let course;
    try {
      course = await courseModel.findById(course_id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, msg: "Course is not found" });
      }

      //check user already pay for course or not
      const uId = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uId)) {
        return res.status(400).json({
          success: false,
          msg: "Student already enrolled",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          success: false,
          msg: "error while validating course and user during creating order",
        });
    }
    //order Create
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        couseId: course_id,
        userId,
      },
    };

    try {
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      //return res
      return res
        .status(200)
        .json({
          success: true,
          msg: "course order created successfully",
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          thumbnail: course.thumbnail,
          orderId: paymentResponse.id,
          currency: paymentResponse.currency,
          amount: paymentResponse.amount,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({
          success: false,
          msg: "something went wrong while intitating the order",
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        msg: "something went wrong while capturing the payment",
      });
  }
};

//verify signature of razorpay
exports.verifyPayment = async (req, res) => {
  try {
    const webHookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature == digest) {
      console.log("payment is authorized");
      const { userId, courseId } = req.body.payload.payment.entity.notes;

        //fullfill the action
        // find the course and add user init
        const enrolledCourse = await courseModel.findOneAndUpdate(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: true },
        );

        if (!enrolledCourse) {
          return res
            .status(404)
            .json({ success: false, msg: "course not found" });
        }
        console.log(enrolledCourse);

        //find the user and add courses init
        const enrolledStudent = await userModel.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              courses: courseId,
            },
          },
          { new: true },
        );

        if (!enrolledStudent) {
          return res
            .status(404)
            .json({ success: false, msg: "user not found" });
        }
        console.log(enrolledStudent);

        //mail send kerdo confirmation wala
        const emailResponse = await sendMail(
            enrolledStudent.email,
            "Congragulation from eduaction_Point",
            "Congragulation, you are onboarded into new eduaction_point course",
        )
        console.log(emailResponse);
        return res.status(200).json({success:true,msg:"signature verified and course added"});
    }else{
        return res.status(400).json({success:false, msg:"signature and digest is not match"})
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,msg:"something went wrong, while verifying signature"});
  }
};
