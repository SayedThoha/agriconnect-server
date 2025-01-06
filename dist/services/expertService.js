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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const hashPassword_1 = require("../utils/hashPassword");
const otp_1 = require("../utils/otp");
const sendOtpToMail_1 = require("../utils/sendOtpToMail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ExpertServices {
    constructor(expertRepository, jwtSecret = process.env.JWT_SECRET || "default_secret") {
        this.expertRepository = expertRepository;
        this.jwtSecret = jwtSecret;
        this.OTP_EXPIRY_MINUTES = 59;
    }
    registerExpert(expertData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingExpert = yield this.expertRepository.findByEmail(expertData.email);
            if (existingExpert) {
                return { status: false, message: "Email already exists" };
            }
            const hashedPassword = yield (0, hashPassword_1.hashedPass)(expertData.password);
            const otp = (0, otp_1.generateOtp)();
            const expert = yield this.expertRepository.create(Object.assign(Object.assign({}, expertData), { password: hashedPassword, otp, otp_update_time: new Date() }));
            if (!expert) {
                return { status: false, message: "Failed to register user" };
            }
            const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(expertData.email, otp);
            if (!isOtpSent) {
                return { status: false, message: "Failed to send OTP" };
            }
            yield this.expertRepository.createKyc(expert._id.toString());
            return { status: true, message: "Expert Registration successful" };
        });
    }
    validateRegistrationData(data) {
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "contactno",
            "profile_picture",
            "specialisation",
            "current_working_address",
            "experience",
            "consultation_fee",
            "identity_proof_type",
            "identity_proof",
            "expert_licence",
            "qualification_certificate",
            "experience_certificate",
            "password",
        ];
        return requiredFields.filter((field) => !data[field]);
    }
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.expertRepository.getSpecialisations();
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate new OTP
                const otp = (0, otp_1.generateOtp)();
                // Update user with new OTP
                const updatedExpert = yield this.expertRepository.updateExpertOtp(email, otp);
                if (!updatedExpert) {
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
                const expert = yield this.expertRepository.findByEmail(email);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                // Verify OTP
                if (expert.otp !== otp) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect OTP",
                    };
                }
                // Check OTP expiration
                const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
                const timeDifference = Math.floor((new Date().getTime() - expert.otp_update_time.getTime()) / 1000);
                if (timeDifference > otpExpirySeconds) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "OTP Expired",
                    };
                }
                // Update user verification status
                const updatedExpert = yield this.expertRepository.updateExpertVerification(email, true, role ? newEmail : undefined);
                if (!updatedExpert) {
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
    loginExpert(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find expert
                const expert = yield this.expertRepository.findByEmail(email);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid username",
                    };
                }
                // Verify password
                const passwordMatch = yield (0, hashPassword_1.comparePass)(password, expert.password);
                if (!passwordMatch) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect password",
                    };
                }
                // Check if user is blocked
                if (expert.blocked === true) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.FORBIDDEN,
                        message: "Your account is blocked by Admin",
                    };
                }
                // Check if user is verified
                if (expert.is_verified === false) {
                    // Generate and save new OTP
                    const otp = (0, otp_1.generateOtp)();
                    const updatedExpert = yield this.expertRepository.updateExpertOtpDetails(expert._id.toString(), otp);
                    if (!updatedExpert) {
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
                const accessToken = jsonwebtoken_1.default.sign({ expertId: expert._id }, this.jwtSecret);
                // Create user object for response
                const accessedUser = {
                    _id: expert._id,
                    firstName: expert.firstName,
                    lastName: expert.lastName,
                    email: expert.email,
                    role: expert.role,
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
exports.default = ExpertServices;
