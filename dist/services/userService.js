"use strict";
/* eslint-disable  @typescript-eslint/no-explicit-any */
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
const otp_1 = require("../utils/otp");
const sendOtpToMail_1 = require("../utils/sendOtpToMail");
// import { MESSAGES } from "../constants/messages";
const hashPassword_1 = require("../utils/hashPassword");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserServices {
    constructor(userRepository, jwtSecret = process.env.JWT_SECRET || "default_secret") {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.OTP_EXPIRY_MINUTES = 59;
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise<Record<string, any>>
            try {
                // console.log("hello the service reached");
                console.log("Registration service started for email:", userData.email);
                // Check if the user already exists
                const existingUser = yield this.userRepository.emailExist(userData.email);
                console.log("Email existence check result:", existingUser);
                if (existingUser) {
                    return { success: false, message: "Email already exists" };
                }
                // Hash password and generate OTP
                console.log("Reached password hashing...");
                const hashedPassword = yield (0, hashPassword_1.hashedPass)(userData.password);
                console.log("Hashed Password:", hashedPassword);
                console.log("Generating OTP...");
                const otp = (0, otp_1.generateOtp)();
                console.log("Generated OTP:", otp);
                // Create user data
                const user = yield this.userRepository.saveUser({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: hashedPassword,
                    otp,
                    otp_update_time: new Date(),
                });
                if (!user) {
                    return { success: false, message: "Failed to register user" };
                }
                // Send OTP via email
                const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(userData.email, otp);
                if (!isOtpSent) {
                    return { success: false, message: "Failed to send OTP" };
                }
                return { success: true, message: "Verify OTP to complete registration" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate new OTP
                const otp = (0, otp_1.generateOtp)();
                // Update user with new OTP
                const updatedUser = yield this.userRepository.updateUserOtp(email, otp);
                if (!updatedUser) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                // Send OTP via email
                const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
                if (!isOtpSent) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                        message: "Failed to send OTP",
                    };
                }
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Successfully sent a new OTP",
                };
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal server error",
                };
            }
        });
    }
    verifyOtp(email, otp, role, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                // Verify OTP
                if (user.otp !== otp) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect OTP",
                    };
                }
                // Check OTP expiration
                const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
                const timeDifference = Math.floor((new Date().getTime() - user.otp_update_time.getTime()) / 1000);
                if (timeDifference > otpExpirySeconds) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "OTP Expired",
                    };
                }
                console.log("Updating user verification status...");
                // Update user verification status
                const updatedUser = yield this.userRepository.updateUserVerification(email, true, role ? newEmail : undefined);
                console.log("Updated user:", updatedUser);
                if (!updatedUser) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                        message: "Failed to update user verification status",
                    };
                }
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Account verified successfully",
                };
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal server error",
                };
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid username",
                    };
                }
                // Verify password
                const passwordMatch = yield (0, hashPassword_1.comparePass)(password, user.password);
                if (!passwordMatch) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect password",
                    };
                }
                // Check if user is blocked
                if (user.blocked === "true") {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.FORBIDDEN,
                        message: "Your account is blocked by Admin",
                    };
                }
                // Check if user is verified
                if (user.is_verified === false) {
                    // Generate and save new OTP
                    const otp = (0, otp_1.generateOtp)();
                    const updatedUser = yield this.userRepository.updateUserOtpDetails(user._id.toString(), otp);
                    if (!updatedUser) {
                        return {
                            success: false,
                            statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                            message: "Failed to update OTP",
                        };
                    }
                    // Send OTP
                    const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
                    if (!isOtpSent) {
                        return {
                            success: false,
                            statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                            message: "Failed to send OTP",
                        };
                    }
                    return {
                        success: true,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                        message: "Complete OTP verification for Login",
                        email: email,
                    };
                }
                // Generate JWT token
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, this.jwtSecret);
                // Create user object for response
                const accessedUser = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                };
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Login successful",
                    accessToken,
                    accessedUser,
                };
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal server error",
                };
            }
        });
    }
}
exports.default = UserServices;
