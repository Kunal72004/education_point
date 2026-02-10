const nodemailer = require('nodemailer');

const sendMail = async(email , title , body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: 'education_point form Kunal sikarwar',
            to:`${email}`,
            subject:`${title}`,
            body:`${body}`
        })
        console.log(info);
        return info;
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = sendMail;