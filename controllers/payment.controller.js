// import AppError from "../utils/error.util.js";
// import User from "../models/user.model.js";
// import {razorpay} from '../server.js';
// import crypto from 'crypto';

// export const getRazorpayApiKey=async(req,res,next)=>{
//   try{
       
//     res.status(200).json({
//       success:true,
//       message:'Razorpay Api key',
//       //key:process.env.RAZORPAY_KEY_ID
//   })
//   }
//   catch(e){
//          return next(new AppError(e.message,500));  
//   }
  
// }


// export const buySubcription=async(req,res,next)=>{


//   try{
//     const {}=req.user;
//     const user=await User.findById(id);
//     if(!user){
//       return next(
//           new AppError('Unauthorised,please login',500)
//       )
//     }

//     if(user.role==='ADMIN'){
//     return next(
//       new AppError('Admin cannot purchase a subcription',400)
//     )  
//     }

//     const subscription= await razorpay.subscriptions.create({
//       plan_id:process.env.RAZORPAY_PLAN_ID,
//       customer_notify:1
//     });

//     user.subscription.id=subscription.id;
//     user.subscription.status=subscription.status;

//     await user.save();
    
//     res.status(200).json({
//       success:true,
//       message:'Subscribed Successfully',
//       subscription_id:subscription.id
//     })

//   }
//   catch(e){
//     return next(new AppError(e.message,500));
//   }
     
// }

// export const verifySubcription=async(req,res,next)=>{

//   try{

//     const {id}=req.body;
//     const {razorpay_payment_id, razorpay_signature, razorpay_subscription_id
//     }=req.body;

//     const user=await User.findById(id);

//     if(!user){
//         return next(
//             new AppError('Unauthorised,please login')
//         )
//     }

//     const subcriptionId=user.subscription.id;
//     const generatedSignature=crypto
//       .createHmac('sha256',process.env.RAZORPAY_SECRET)
//       .update(`${razorpay_payment_id} | ${ subcriptionId}`)
//       .digest('hex');

//       if(generatedSignature !== razorpay_signature){
//         return next(
//             new AppError('Payment not verified,please try again',400)
//         )
        
//       }

//       await PaymentAddress.create({
//         razorpay_payment_id,
//         razorpay_signature,
//         razorpay_subscription_id
//       })
//       user.subscription.status='active';
//       await user.save();
//       res.status(200).json({
//         success:true,
//         message:'Payment verified successfully1'
//       })

//   }
//   catch(e){
//     return next(new AppError(e.message,500));
//   }
    
// };


// export const cancelSubcription= async(req,res,next)=>{

//   try{
//     const {id}=req.user;
//     const user=await User.findById(id);
//     if(!user){
//       return next(
//           new AppError('Unauthorised,please login',500)
//       )
//     }
  
//     if(user.role==='ADMIN'){
//     return next(
//       new AppError('Admin cannot purchase a subcription',400)
//     )  
//     }
  
//     //if exits the user then
  
//     const subscriptionId=user.subcription.id;
//     const subcription=await razorpay.subscriptions.cancel(
//       subscriptionId
//     )
  
//     user.subscription.status=subcription.status;
//     await user.save();
  
       
//   }
//   catch(e){
//     return next(new AppError(e.message,500));
//   }
  
// }

// export const allPayments=async(req,res,next)=>{
//  try{
 
//   const {count}=req.query;
//   const subcriptions=await razorpay.subscriptions.all({
//     count:count || 10
//   });
//   res.status(200).json({
//     success:true,
//     message:'All Payments',
//     subcriptions
//   })
//  }
//  catch(e){
// return next(new AppError(e.message,500));
//  }

// }