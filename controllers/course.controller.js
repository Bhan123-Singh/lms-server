import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';

import fs from 'fs/promises';

const getAllCourses=async function(req,res,next) {
    
    try{
        const courses= await Course.find({}).select('-lectures');
        // '-select' means don't select lectures
        res.status(200).json({
            success:true,
            message:'All Courses',
            courses,
        
        });
    }
    catch(e){
               return next(new AppError(e.message,500))
    }


}






const getLecturesByCourseId=async function(req,res,next){

    try{
        const {id}=req.params;

        const course=await Course.findById(id);
        if(!course){
            return next(new AppError('Invalid Course id',400))
        }

        res.status(200).json({
            success:true,
            message:'Course lectures fetched successfully',
            lectures:course.lectures
        })

    }
    catch(e){
        return next(new AppError(e.message,500))
    }
}

const createCourse=async(req,res,next)=>{
      const {title,description,category,createdBy}=req.body;
      console.log("title",title);
      console.log("description",description);
      console.log("category",category);
      console.log("createdBy",createdBy);
      
       if(!title || !description || !category || !createdBy){
        return next(new AppError('All fields are required',500))
       }
       console.log('createcourse',title,description,category,createdBy);



    const course=await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{ 
        public_id:'dummy',
        secure_url:'dummy'
    }

    
    
    });

   console.log("course:",course)
    
    if(!course){
        return next(new AppError('Course could not be created,please try again',500))
    }
 
    console.log('reqFile',JSON.stringify(req.file))
    if(req.file)
       try {
            
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        });
    
        if(result){
            course.thumbnail.public_id=result.public_id;
            course.thumbnail.secure_url=result.secure_url;
        }
        fs.rm(`uploads/${req.file.filename}`);
    }

    catch(e){
        return next(new AppError(e.message,500))
}

    
    await course.save()// to save the database

    res.status(200).json({
        success:true,
        message:'Course created successfully',
        course,
    })
}




const updateCourse=async(req,res,next)=>{
  
    try{
         const {id}=req.params;
         const course=await Course.findByIdAndUpdate(id,{
          $set:req.body
         },
         {
            runValidators:true //it checks the data or right or wrong

         }
        );
        if(!course){
            return next(new AppError('Course with given id does not exist',500))

        }
        
        res.status(200).json({
            success:true,
            message:'Course updated successfully!',
            course
        })
    }   
    catch(e){
              new AppError(e.message,500)
    }         
}

const removeCourse=async(req,res,next)=>{

     try{
          const {id}=req.params;
          const course= await Course.findById(id);
          if(!course){
            return next( new AppError('Course with given id does not exits,500'))
          }
         await Course.findByIdAndDelete(id);
         res.status(200).json({
            success:true,
            message:'Course deleted successfully'
         }) 
     }
     catch(e){
        return next(new AppError(e.message));
     }
}

//for adding the course
const addLectureToCourseById=async(req,res,next)=>{
    try{

        const {title,description}=req.body;
        const {id}=req.params;
        console.log("id->",id)
        
        if(!title || !description){
            return next (new AppError('All field are requireed',400))
        }
    
        const course=await Course.findById(id);
        console.log('courseId->',course)
         if(!course){
            return next(new AppError('Course with given id does not exits',500))
         }

      const lectureData={
        title,
        description,
        lecture:{}
      };
    
      if(req.file){
                      
        try {
            {
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:'lms'
        });
    
        if(result){
            lectureData.lecture.public_id=result.public_id;
            lectureData.lecture.secure_url=result.secure_url;
        }
        fs.rm(`uploads/${req.file.filename}`);
    }
    
    await course.save()// to save the database
    
    res.status(200).json({
        success:true,
        message:'Course added successfully',
        course
    })
    }
    catch(e){
          return next(new AppError(e.message,500))
    }
    
    }

     console.log('lecture>',JSON.stringify(lectureData)) //for printing th data
    course.lectures.push(lectureData);
    course.numbersOflectures=course.lectures.length;
    await course.save();// save in database
    res.status(200).json({
         success:true,
         message:'Lecture successfully to added the course',
         course
    })
        
    }
    catch(e){
              return next(new AppError(e.message,500));
    }
    
  
}
export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}