"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }
    catch (error) {
        console.error("Error generating OTP:", error);
        throw new Error("Failed to generate OTP");
    }
};
exports.generateOtp = generateOtp;
