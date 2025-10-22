import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import config from "../config";

// Configure Cloudinary once
cloudinary.config({
  cloud_name: config.cloud_name ,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// Multer disk storage with extension preserved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads"); // make sure 'uploads' folder exists manually
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Upload to Cloudinary async/await version
const uploadToCloudinary = async (file: any) => {
  const result = await cloudinary.uploader.upload(file.path, {
    public_id: path.parse(file.originalname).name,
    resource_type: "auto",
  });

  return result;
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
