const jwt = require('jsonwebtoken');

//authenticate (login token check)
const authentication = async(req,res,next)=>{
    try {
        //extract token
        let token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer " , "");

        //check toke is missing or not
        if(!token){
            return res.status(401).json({success:false, msg:"token is required or invalid"});
        }

        //verify the token 
        try {
            let decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            
        } catch (error) {
            //verificataion issue
            return res.status(401).json({success:false,msg:"invalid token"});
        }

        next();
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, msg:"something went wrong while token authentication"})
        
    }
}
//Authorization (isStudent)
const isStudent = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({success:false, msg:"This is a procted route for Students only"})
        }
        next();
    } catch (error) {
        return res.status(500).json({success:false, msg:"Internal server error"})
    }
}
//Authorization (isInstructor)
const isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({success:false, msg:"This is a procted route for Instructor only"})
        }
        next();
    } catch (error) {
        return res.status(500).json({success:false, msg:"Internal server error"})
    }
}
//Authorization (isAdmin)
const isAdmin = async(req,res,next)=>{
    try {
        console.log(req.user.accountType);
        
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({success:false, msg:"This is a procted route for Admin only"})
        }
        next();
    } catch (error) {
        return res.status(500).json({success:false, msg:"Internal server error"})
    }
}

module.exports = {authentication,isStudent,isInstructor,isAdmin};