 import express from 'express';
import morgan from 'morgan'
const app=express();
import cors from 'cors';
import cookieParser from  'cookie-parser';
import {config} from 'dotenv';
import userRoutes from './routes/user.routes.js';
import courseRoutes from  './routes/course.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
//import paymentRoutes from './routes/payment.route.js';

config();
app.use(express.json());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}));
app.use(cookieParser());

app.use(express.urlencoded({extended:true})); //use for get query to param from encodedurl
app.use(morgan('dev'));  // It is a library which is the see the url path on the console log

app.use('/ping',function(req,res){
    res.send('Pong');
});
app.get("/", (req, res) => {
  res.send("Server is running...");
});




// Routes  define for user 3 modules
app.use('/api/v1/user',userRoutes);

// Routes define course routes here
app.use('/api/v1/courses',courseRoutes);

//Routes define for payment here
//app.use('api/v1/payments',paymentRoutes);

app.all('*',(req,res)=>{
    res.status(404).send('oops! 404 page not found');
});
app.use(errorMiddleware);


export default app;
