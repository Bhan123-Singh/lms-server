//creata the custom middleware for sending the data to user
/* if any occurrs error in app then App goback to Router and go to next step -> if find errorMiddleware
then the execute the file error.middleware and send the error message to user 
*/




const errorMiddleware=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500; // if the user forgot the proper message then use it's
    err.message = err.message || "something went wrong!"; //if the user forgot the proper message then use it's
    return res.status(err.statusCode).json({  //for returning the message to user for seeing
        success:false,
        message:err.message,
        stack:err.stack
    })
}
export default errorMiddleware;