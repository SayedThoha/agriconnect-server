"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// multer.ts in utils
const multer_1 = __importDefault(require("multer"));
// import fs from "fs";
// import path from "path";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "docs/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
        // cb(null, file.originalname);
    },
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, "../docs");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
