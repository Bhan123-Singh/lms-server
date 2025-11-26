import mongoose from "mongoose";
mongoose.set('strictQuery',false);

//using async and await function here
const connectionToDB=async()=>{
    try{
        const {connection}=await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/lms');
        if(connection){
            console.log(`connected to mongodb ${connection.host}`);
        }
    }
    catch(e){
        console.log(e);
        process.exit(1);
    }
}

export default connectionToDB ;