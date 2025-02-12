"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadProfilePicTest_1 = require("../utils/uploadProfilePicTest");
const profileRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
profileRouter.post("/upload/profilepic", upload.single("file"), uploadProfilePicTest_1.uploadProfilePic);
// const imageController = new ImageController();
// profileRouter.post('/upload', upload.single('file'), (req,res)=>imageController.uploadFile(req,res));
exports.default = profileRouter;
