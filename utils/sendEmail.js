import nodemailer from 'nodemailer';
//async await is not allowed in global scope,must use a wrapper
const sendEmail=async function(email,subject,message){
    //create reuseable transporter object using the default SMTP Transport
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false, // true for 465,false for other ports
        auth:{
            user:process.env.SMTP_USERNAME,
            pass:process.env.SMTP_PASSWORD,
        },
    });
    // send mail with defined transport object
    await transporter.sendMail({
        from:process.env.SMTP_FROM_EMAIL,// sender address
        to:email,// user mail
        subject:subject,// Subject line
        html:message, // html body
    });
};

export default sendEmail;