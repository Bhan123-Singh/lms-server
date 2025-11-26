import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken'
const isLoggedIn=async(req,res,next)=>{
    const{token}=req.cookies;
    if(!token) {
        return next(new AppError('Unauthenticated,please login again',400))
    }
    const userDetails= await jwt.verify(token,process.env.JWT_SECRET);
    req.user=userDetails;
    next();
}

//for checking role
const  authorizedRoles=(...roles)=>(req,res,next)=>{   // ...role is closure
       const currentUserRoles=req.user.role;
       if(!roles.includes(currentUserRoles)){
return next(
    new AppError('you do not not have permission to access this route',400)
)
         
       }

       next();// if all is right the next

}

export{
    isLoggedIn,
    authorizedRoles
}