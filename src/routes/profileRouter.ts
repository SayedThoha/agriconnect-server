import express from "express";
import multer from "multer";
import { uploadProfilePic } from "../utils/uploadProfilePicTest";




const profileRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
profileRouter.post("/upload/profilepic", upload.single("file"), uploadProfilePic);
// const imageController = new ImageController();

// profileRouter.post('/upload', upload.single('file'), (req,res)=>imageController.uploadFile(req,res));

export default profileRouter;
