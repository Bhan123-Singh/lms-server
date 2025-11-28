import mongoose from "mongoose";
mongoose.set('strictQuery',false);

//using async and await function here
const connectionToDB=async()=>{
    try{
        const {connection}=await mongoose.connect(process.env.MONGODB_URI);
        if(connection){
            console.log(`connected to mongodb ${connection.host}`);
        }
    }
    catch(e){
        console.log(" MongoDb connection failed", e);
        process.exit(1);
    }
}

export default connectionToDB ;