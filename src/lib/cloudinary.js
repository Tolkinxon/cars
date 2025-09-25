import cloudinary from "cloudinary";
import multer from "multer";
let {v2} = cloudinary;

v2.config({
    api_key: process.env.CLOUD_APIKEY,     
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_SECRET,
})
 
export let upload = multer({storage: multer.memoryStorage()})