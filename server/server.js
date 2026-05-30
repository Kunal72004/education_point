const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnect } = require("./src/config/db");
const { cloudinaryConnect } = require("./src/config/cloudinary");

//import routes
const userRoutes = require('./src/routes/userRoute');
const profileRoutes = require('./src/routes/profileRoute');
const courseRoutes = require('./src/routes/courseRoute');
const paymentRoutes = require('./src/routes/paymentRoute');
const contactUsRoutes = require('./src/routes/contactRoute');

dotenv.config();

const PORT = process.env.PORT || 4000;
//db connect
dbConnect();

//Cloudinary connect
cloudinaryConnect();

//middleWares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://education-point-ten.vercel.app",
    credentials: true,
  }),
);
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp",
}));

//rout mount
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/reach",contactUsRoutes);


app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

