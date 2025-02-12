"use strict";
// // src/config/s3Config.ts
// import { ObjectCannedACL, S3Client } from "@aws-sdk/client-s3";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
// // src/controllers/imageController.ts
// import { Request, Response } from "express";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// // import { s3Client } from '../config/s3Config';
// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });
// // Configure multer for memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Not an image! Please upload an image."));
//     }
//   },
// }).single("file");
// export class ImageController {
//   async uploadProfilePic(req: Request, res: Response): Promise<void> {
//     try {
//       // Handle file upload using multer
//       upload(req, res, async (err) => {
//         if (err) {
//           return res.status(400).json({ message: err.message });
//         }
//         if (!req.file) {
//           return res.status(400).json({ message: "No file uploaded" });
//         }
//         const file = req.file;
//         const folder = req.body.folder || "default";
//         // Generate unique filename
//         const fileExtension = file.originalname.split(".").pop();
//         const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
//         try {
//           // Upload to S3
//           const uploadParams = {
//             Bucket: process.env.AWS_BUCKET_NAME!,
//             Key: fileName,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//             ACL: ObjectCannedACL.public_read,
//           };
//           await s3Client.send(new PutObjectCommand(uploadParams));
//           // Generate the URL for the uploaded file
//           const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
//           return res.status(200).json({
//             message: "File uploaded successfully",
//             fileUrl,
//           });
//         } catch (error) {
//           console.error("S3 upload error:", error);
//           return res.status(500).json({
//             message: "Error uploading file to S3",
//           });
//         }
//       });
//     } catch (error) {
//       console.error("Controller error:", error);
//       res.status(500).json({
//         message: "Internal server error",
//       });
//       return;
//     }
//   }
// }
// require('dotenv').config();
// const AWS = require('aws-sdk');
// const multer = require('multer');
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
class ImageController {
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req);
                if (!req.file) {
                    res.status(400).json({ error: 'No file uploaded' });
                    return;
                }
                const bucketName = process.env.AWS_BUCKET_NAME;
                if (!bucketName) {
                    res.status(500).json({ error: "S3 Bucket name is not configured" });
                    return;
                }
                const fileContent = req.file.buffer;
                const fileName = `profile-pictures/${Date.now()}-${req.file.originalname}`;
                const params = {
                    Bucket: bucketName,
                    Key: fileName,
                    Body: fileContent,
                    ContentType: req.file.mimetype,
                    ACL: 'public-read', // Makes the file publicly accessible
                };
                const data = yield s3.upload(params).promise();
                res.json({ imageUrl: data.Location });
                return;
            }
            catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Failed to upload file' });
            }
        });
    }
    ;
}
exports.ImageController = ImageController;
