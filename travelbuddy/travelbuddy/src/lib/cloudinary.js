import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();
 // ... rest of the code

 cloudinary.config({
    cloud_name:process.env.Cloudnary_Cloud_Name,
    api_key:process.env.Cloudnary_Api_Key,
    api_secret:process.env.Cloudnary_Api_Secret
 });
 export default cloudinary;