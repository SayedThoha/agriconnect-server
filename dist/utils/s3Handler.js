"use strict";
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
exports.uploadToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const uploadToS3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Upload Request Details:", {
    //   file: req.file
    //     ? {
    //         originalname: req.file.originalname,
    //         mimetype: req.file.mimetype,
    //         size: req.file.size,
    //       }
    //     : "No file",
    //   body: req.body,
    // });
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        if (!req.body.folder) {
            res.status(400).json({ message: "Folder name is required" });
            return;
        }
        const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
        const file = req.file;
        if (!allowedMimeTypes.includes(file.mimetype)) {
            res.status(400).json({ message: "Invalid file type" });
            return;
        }
        const folder = req.body.folder.replace(/[^a-zA-Z0-9-_]/g, "");
        const fileExtension = file.originalname.split(".").pop();
        const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        let processedBuffer = file.buffer;
        if (file.mimetype.startsWith("image/")) {
            processedBuffer = yield (0, sharp_1.default)(file.buffer)
                .resize(200, 200, { fit: "cover" })
                .toBuffer();
        }
        const uploadParams = {
            Bucket: "agriconnect-bucket",
            Key: fileName,
            Body: processedBuffer,
            ContentType: file.mimetype,
        };
        const result = yield s3.upload(uploadParams).promise();
        // console.log(result);
        res.json({
            fileUrl: result.Location,
            key: result.Key,
        });
    }
    catch (error) {
        console.error("S3 upload error:", error);
        res.status(500).json({
            message: "Error uploading file to S3",
            errorDetails: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.uploadToS3 = uploadToS3;
