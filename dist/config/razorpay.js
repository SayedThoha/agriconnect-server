"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRazorpayInstance = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
// export const createRazorpayInstance = () => {
//   const keyId = process.env.razorpay_key_id;
//   const keySecret = process.env.razorpay_secret_id;
//   if (!keyId || !keySecret) {
//     throw new Error(
//       "Razorpay key_id or key_secret is missing in environment variables."
//     );
//   }
//   return new Razorpay({
//     key_id: keyId,
//     key_secret: keySecret,
//   });
// };
const getRazorpayInstance = () => {
    const keyId = process.env.razorpay_key_id;
    const keySecret = process.env.razorpay_secret_id;
    if (!keyId || !keySecret) {
        throw new Error("Razorpay key_id or key_secret is missing in environment variables.");
    }
    return new razorpay_1.default({
        key_id: keyId,
        key_secret: keySecret,
    });
};
exports.getRazorpayInstance = getRazorpayInstance;
