import bcrypt from 'bcryptjs'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../Models/doctorModel.js';
import validator from 'validator';
import upload from '../multer.cjs';
import jwt from 'jsonwebtoken'


// API for  doctors
const addDoctor = async(req, res) =>{

    try {
        
        const { name, email, password, speciality, degree, experience, about, fees, address} = req.body;

        const imageFile = req.file
        console.log(imageFile)

        // console.log({ name, email, password, speciality, degree, experience, about, fees, address},imageFile)

        if( !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success: false, message: "Missing details!"})

        }

       

        // validating email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email!"})
        }


        // validating strong password
        if(password.length < 8){
            return res.json({success: false, message: "Password must be 8 characters"})
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)



        // upload image to cloudinary
        // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        // const imageUrl = imageUpload.secure_url;
        // const imagePath = imageUpload.public_id;


//         const fileTypes = /jpeg|jpg|png|gif/;
// if (!req.file.mimetype.match(fileTypes)) {
//   return res.json({ success: false, message: 'Only image files are allowed' });
// }


const doctorData = {
    name,
    email,
    password:hashedPassword,
    speciality,
    // image:imageUrl,
    // path:imagePath,
            degree,
            experience,
            about,
            fees,
            Date:Date.now(),
            address: JSON.parse(address)
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true, message: "Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


// API FOR ADMIN LOGIN
const loginAdmin = async (req, res)=>{


try {

    const {email, password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

        const token = jwt.sign(email+password, process.env.JWT_SECRET)
        res.json({success: true, token})

    }else{
        res.json({success: false, message: "Invalid credentials"})
    }
    
} catch (error) {
    console.log(error)
    res.json({success:false, message: error.message})
}


}


export {addDoctor, loginAdmin}