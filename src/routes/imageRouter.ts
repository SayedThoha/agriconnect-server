import express from "express";
import multer from "multer";
import { uploadToS3 } from "../utils/s3Handler";

const imageRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRouter.post("/upload/s3", upload.single("file"), uploadToS3);

export default imageRouter;
