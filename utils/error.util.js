    /* create a Generic method for error handling
    GENERIC METHOD-> it less number of code  and use same commonds in other error handling
    and more accessable and readable 
    */
    
    
    
    class AppError extends Error{  //if arise the any error in App then extends the Error
    constructor(message,statusCode){
        super(message);

        this.statusCode=statusCode;

        Error.captureStackTrace(this,this.constructor); /* captureStackTrack=>it defines the on which place mera code kaha par fata h kaha nhi */

    }
}

export default AppError;

//returns the stance error app like status code stack error,etc