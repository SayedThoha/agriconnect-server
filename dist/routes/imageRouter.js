"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const s3Handler_1 = require("../utils/s3Handler");
// import { uploadProfilePic } from "../utils/uploadProfilePic";
// import { uploadProfileImage } from "../utils/uploadProfilePic";
const imageRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
imageRouter.post("/upload/s3", upload.single("file"), s3Handler_1.uploadToS3);
// imageRouter.post("/uploadprofilepic",uploadProfileImage)
imageRouter.post("/uploadprofilepic", upload.single("file"), (req, res) => {
    console.log(res);
    console.log('Headers:', req.headers);
    console.log('File:', req.file);
    console.log('Body:', req.body);
});
exports.default = imageRouter;
