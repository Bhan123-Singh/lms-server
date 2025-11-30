import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
import connectionToDB from '../config/dbConnection.js';

const cookieOptions={
     maxAge:7*24*60*1000, //7days
     httpOnly:true,
     secure:true,
}

const register=async(req,res,next)=>{
 const {fullName,email,password}=req.body;
 if(!fullName || !email || !password){
   return next(new AppError('All fields are required',400))  /* if arise the error then execute the process->
                                                                AppError ->(if user forgot given the some condition then use -> errorMiddleware*/
 }
   await connectionToDB();
 const userExits= await User.findOne({email});
 if(userExits){
   return next(new AppError('Email already exits',400))
 }
 
  await connectionToDB();
 const user= await User.create({
    fullName,
    email,
    password,
    avatar:{
        public_id:'',
        secure_url:''
    }
 });
 if(!user){
    return next(new AppError('User registration failed,please try again'))
 }

 //TODO:File upload
 
 console.log("file details->",JSON.stringify(req.file));
 if(req.file) {
  
  try{
       const result=await cloudinary.uploader.upload(req.file.path,{ //folder lms -> it upload the cloudinary in lms folder
        folder:'lms',
        width:250,
        height:250,
        gravity:'faces',
        crop:'fil'
       });

       if(result){
        user.avatar.public_id=result.public_id; //for converting the plublic url into cloudinary avatar public url
        user.avatar.secure_url=result.secure_url; //for convert the secure url into secure avatar url

        //Remove file from server
        fs.rm(`uploads/${req.file.filename}`)
       }
  }
  catch(e){
     return next(new AppError('File not uploaded,please try again',500))
  }
 }


 await user.save();   // to save the user informatio in database


 user.password=undefined;
 const token=await user.generateJWTToken();
 res.cookie('token',token,cookieOptions)
 res.status(200).json({
  success:true,
  message:'User registered successfuly',
  user
 })

}

const login=async(req,res,next)=>{
  try{
    const {email,password}=req.body;
    console.log(password)
    if(!email || !password){
      return next(new AppError('All field are required',400));
    }
     await connectionToDB();
    const user= await User.findOne({
      email
    }).select('+password');
    
 console.log(user)
 
    if(!user ){
      return next(new AppError('Email or Password does not match',400))
    }

    const isPasswordCorrect = await user.comparePassword( password );

    if ( !isPasswordCorrect ) {
      return next( new AppError ( ' Email or password does not match', 400))
    }
     await connectionToDB();
    const token= await user.generateJWTToken();
    user.password=undefined;
    res.cookie('token',token,cookieOptions);
    res.status(200).json({
      success:true,
      message:'User loggedin successfully',
      user
    })
  }
  catch(e){
          return next(new AppError(e.message,500))
  }

}

const logout=(req,res)=>{
    res.cookie('token',null,{
      secure:true,
      maxAge:0,
      httpOnly:true
    });

    res.status(200).json({
      success:true,
      message:'user logged out successfully'
    })

};
const getProfile=async(req,res)=>{

  try{ 
     await connectionToDB();
    const userId=req.user.id;
    const user=await User.findById(userId);
    res.status(200).json({
      success:true,
      message:"User details",
      user
    });
  }
  catch(e){
        return next(new AppError('Failed to fetch Profile',400))
  }
     
};

//when user password is forgot
const forgotPassword=async(req,res,next)=>{
      const{email}=req.body;
      if(!email){
        return next(new AppError('Email is required',400));

      }
      const user=await User.findOne({email});
      if(!user){
        return next(new AppError('Email not registered,400'));

      }
      const resetToken=await user.generatePasswordResetToken();
      console.log(resetToken)
      await user.save(); //to save the database
      const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      console.log(resetPasswordURL);
  
      const subject='Reset Password';
      const message =`You can reset your password by clicking <a href=${resetPasswordURL} target=_blank`
      try{
            await sendEmail(email,subject,message);
            res.status(200).json({
              success:true,
              message:`Reset password token has been sent to ${email}
suceessfylly`            })
      }
      catch(e){ /* if can not send the email  to user for any reason like network 
                  weak error or my code crashed /code fat jana
                  then set the forgotpasswordexpiry and forgotpasswordtoken
                  are undefined,
                  If next time send the email to user.
                  with generate new forgotpasswordexpiry and forgotpasswordtoken.

                  
                      */
               user.forgotPasswordExpiry=undefined;
               user.forgotPasswordToken=undefined;
               await user.save();// to save in database
           return next(new AppError(e.message,500))
      }
};


const resetPassword=async(req,res,next)=>{
      const {resetToken}=req.params;
      console.log("resettoken->",resetToken)
      const {password}=req.body;
      console.log("password->",password)
      const forgotPasswordToken=crypto
       .createHash('sha256')
       .update(resetToken)
       .digest('hex');
console.log("forgotpassword->",forgotPasswordToken)
      const user=await User.findOne({ //for checking token is valid or not

        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
      });

      console.log("userdata->",user)
      if(!user){
         return next
      (  new AppError('Token is invalid or expired,please try again',400))
      }

      //if user token is valid then
      //set the new password for user whose  came through the resetpassword
      user.password=password; 
       user.forgotPasswordToken= undefined; /* after generating the new password for user 
                                                then after undefined the forgotpasswordtoken and forgotpasswordexpiry*/
       user.forgotPasswordExpiry=undefined;
       user.save();//to save the database
       res.status(200).json({
        success:true,
        message:'Password changed successfully!'
       })
}

//when user want to change password

const changePassword=async(req,res,next)=>{
   const {oldPassword,newPassword}=req.body;
   console.log('oldPassword:',oldPassword);
   console.log('newpassword:',newPassword)
   const{id}=req.user;
   console.log("id",id)
   if(!oldPassword || !newPassword){
    return next(new AppError('All field are mandatory',400))
   }

   const user=await User.findById(id).select('+password');
   if(!user){
    return next(new AppError('user does not exits!',400))
   }

   const isPasswordValid=await user.comparePassword(oldPassword);
   if(!isPasswordValid){
    return next(new AppError('Invalid old password',400))
   }
   user.password=newPassword; //change the oldpassword to newpassword
   await user.save();// to update in database

   user.password=undefined;
   res.status(
    200
   ).json({
    success:true,
    message:'Password changed successfully'
   })
}

const updateUser=async(req,res,next)=>{
  const {fullName}=req.body; //take fullName from multer in req
  const {id}=req.user;// take id to token ,url
   await connectionToDB();
  const user=await User.findById(id);
  console.log("user",user)
  //for checking id exists in databse or not
  //for debugging purpose
  console.log("fullName",fullName)
  console.log("id",id)
  if(!user) {
    return next(new AppError('user does not exit',400))
  }

  //if user exits the database then
  console.log("req",req.body)
  if(req.body){
    user.fullName=fullName;
  
  }

  if(req.file){
      await cloudinary.uploader.destroy(user.avatar.public_id);
 //after destroying the file upload new file

 try{
  const result=await cloudinary.uploader.upload(req.file.path,{
   folder:'lms',
   width:250,
   height:250,
   gravity:'faces',
   crop:'fil'
  });

  if(result){
   user.avatar.public_id=result.public_id; //for converting the plublic url into cloudinary avatar public url
   user.avatar.secure_url=result.secure_url; //for convert the secure url into secure avatar url

   //Remove file from server
   fs.rm(`uploads/${req.file.filename}`)
  }
}
catch(e){
return next(new AppError(e || 'File not uploaded,please try again',500))
}

 
    }

    await user.save(); //to update the database
    res.status(200).json({
      success:true,
      message:'User details updated successfully!',
      user
    })
}
export{
    register,login,logout,getProfile,forgotPassword,resetPassword
,changePassword,updateUser}