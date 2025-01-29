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
Object.defineProperty(exports, "__esModule", { value: true });
const hashPassword_1 = require("../../utils/hashPassword");
const otp_1 = require("../../utils/otp");
const sendOtpToMail_1 = require("../../utils/sendOtpToMail");
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const token_1 = require("../../utils/token");
class UserServices {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.OTP_EXPIRY_MINUTES = 59;
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                if (user.blocked === true) {
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
                // const accessToken = jwt.sign({ userId: user._id }, this.jwtSecret);
                const accessToken = (0, token_1.generateAccessToken)(user._id);
                const refreshToken = (0, token_1.generateRefreshToken)(user._id);
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
                    refreshToken,
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
    getUserDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(id);
            if (!user) {
                throw new Error("user not found");
            }
            return user;
        });
    }
    editUserProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !updateData) {
                throw new Error("User ID and update data are required");
            }
            return this.userRepository.updateUserProfile(id, updateData);
        });
    }
    optForNewEmail(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !email) {
                throw new Error("User ID and email are required");
            }
            const user = yield this.userRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.email === email) {
                throw new Error("Existing email. Try another");
            }
            const otp = (0, otp_1.generateOtp)();
            // Send OTP
            const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
            if (!isOtpSent) {
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Failed to send OTP",
                };
            }
            // const otp = await generateMail(email);
            yield this.userRepository.updateUserById(userId, {
                otp: otp,
                otp_update_time: new Date(),
            });
            return "otp sent to mail";
        });
    }
    editUserProfilePicture(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !imageUrl) {
                throw new Error("Missing required fields");
            }
            yield this.userRepository.updateProfilePicture(userId, imageUrl);
            return "Profile picture updated successfully";
        });
    }
    checkUserStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.userRepository.checkUserStatus(userId);
                return status;
            }
            catch (error) {
                console.error(error);
                throw new Error("Error checking user status");
            }
        });
    }
    verifyEmailForPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("Invalid Email");
                }
                const otp = (0, otp_1.generateOtp)();
                // Send OTP
                const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
                if (!isOtpSent) {
                    {
                        console.log("otp not send");
                    }
                }
                yield this.userRepository.updateUserOtp(email, otp);
            }
            catch (error) {
                console.log(error);
                throw new Error(`Email verification failed`);
            }
        });
    }
    updatePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, hashPassword_1.hashedPass)(password);
                const user = yield this.userRepository.updatePassword(email, hashedPassword);
                if (!user) {
                    return { status: false, message: "User not found" };
                }
                return { status: true, message: "Password Updated" };
            }
            catch (error) {
                throw new Error(`Failed to update password: ${error}`);
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate refresh token
                const decodedRefreshToken = (0, token_1.verifyRefreshToken)(refreshToken); // This method will decode and validate the refresh token
                if (!decodedRefreshToken) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid refresh token",
                    };
                }
                // Find the user based on decoded token
                const user = yield this.userRepository.findUserById(decodedRefreshToken.userId);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                // Generate new access token and refresh token
                const newAccessToken = (0, token_1.generateAccessToken)(user._id);
                const newRefreshToken = (0, token_1.generateRefreshToken)(user._id);
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Token refreshed successfully",
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
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
