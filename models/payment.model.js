import {model,Schema} from 'mongoose';
const paymentSchema=new Schema({
    razorpay_payment_id:{
    type:String,
    require:true
},
razorpay_subcription_is:{
    type:String,
    required:true,
},
razorpay_signature:{
    type:String,
    required:true
}

},{
    timestamps:true
});

const User=model('User',paymentSchema);
export default User;