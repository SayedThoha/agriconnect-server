import express from "express";
import multer from "multer";
import { uploadToS3 } from "../utils/s3Handler";
// import { uploadProfilePic } from "../utils/uploadProfilePic";
// import { uploadProfileImage } from "../utils/uploadProfilePic";


const imageRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRouter.post("/upload/s3", upload.single("file"), uploadToS3);

// imageRouter.post("/uploadprofilepic",uploadProfileImage)
imageRouter.post("/uploadprofilepic",upload.single("file"),(req, res) => {
    console.log(res)
    console.log('Headers:', req.headers);
    console.log('File:', req.file);
    console.log('Body:', req.body);
  })

export default imageRouter;
