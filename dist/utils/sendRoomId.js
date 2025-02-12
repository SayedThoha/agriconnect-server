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
exports.generateMailForRoomId = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateMailForRoomId = (email, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("generateMailForRoomId function");
    // const roomId = roomId;
    console.log("roomId:", roomId);
    const transpoter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.TRANSPORTER_EMAIL,
            pass: process.env.TRANSPORTER_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: email,
        subject: "roomId for the video consultation",
        text: `ROOMID:${roomId}. Your roomId from agriconnect application for the expert consultation through video conference is: ${roomId}.Copy this code and fill the field fo roomId and join.`,
    };
    console.log("mailoptions:", mailOptions);
    return new Promise((resolve, reject) => {
        transpoter.sendMail(mailOptions, (err) => {
            console.log("get into return");
            if (err) {
                console.log("error while generating otp");
                reject(err.message);
            }
            else {
                console.log("generated otp for registration:");
                resolve("otp,resolved email generation for roomId");
            }
        });
    });
});
exports.generateMailForRoomId = generateMailForRoomId;
