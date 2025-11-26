import{Schema,model} from "mongoose";
const courseSchema=new Schema({
    title:{
        type:'String',
        required:[true,'Title is required'],
        minLength:[8,'Title must be at least 8 character'],
        maxLength:[59,'Title should be less 60 character'],
        trim:true,
    },
    description:{
        type:'String',
        required:[true,'Title is required'],
        minLength:[8,'Title must be at least 8 character'],
        maxLength:[200,'Title should be less 60 character'],
        trim:true,

    },

    category:{
        type:'String',
        required:[true,'Category is required'],

    },
    createdBy:{
        type:'String',
        required:true
    },
    thumbnail:{
        public_id:{
            type:'String',
            required:true,
        },
        secure_url:{
            type:'String',
            required:true,
        }
    },
    lectures:[{
        title:String,
        description:String,
        lecture:{
            public_id:{
                type:String
            },
            secure_url:{
                type:String
            }
        }
    }],
    numbersOflectures:{
        type:Number,
        default:0,
    } 
 
},{
    timestamps:true
});

const Course=model('course',courseSchema);
export default Course;