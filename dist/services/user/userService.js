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
const hashPassword_1 = require("../../utils/hashPassword");
const otp_1 = require("../../utils/otp");
const sendOtpToMail_1 = require("../../utils/sendOtpToMail");
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const token_1 = require("../../utils/token");
const razorpay_1 = __importDefault(require("razorpay"));
const notificationService_1 = require("../../utils/notificationService");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.OTP_EXPIRY_MINUTES = 59;
        this.initializeRazorpay();
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.emailExist(userData.email);
                if (existingUser) {
                    return { success: false, message: "Email already exists" };
                }
                const hashedPassword = yield (0, hashPassword_1.hashedPass)(userData.password);
                const otp = (0, otp_1.generateOtp)();
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
                const otp = (0, otp_1.generateOtp)();
                const updatedUser = yield this.userRepository.updateUserOtp(email, otp);
                if (!updatedUser) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
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
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                if (user.otp !== otp) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect OTP",
                    };
                }
                const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
                const timeDifference = Math.floor((new Date().getTime() - user.otp_update_time.getTime()) / 1000);
                if (timeDifference > otpExpirySeconds) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "OTP Expired",
                    };
                }
                const updatedUser = yield this.userRepository.updateUserVerification(email, true, role ? newEmail : undefined);
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
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid username",
                    };
                }
                const passwordMatch = yield (0, hashPassword_1.comparePass)(password, user.password);
                if (!passwordMatch) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect password",
                    };
                }
                if (user.blocked === true) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.FORBIDDEN,
                        message: "Your account is blocked by Admin",
                    };
                }
                if (user.is_verified === false) {
                    const otp = (0, otp_1.generateOtp)();
                    const updatedUser = yield this.userRepository.updateUserOtpDetails(user._id.toString(), otp);
                    if (!updatedUser) {
                        return {
                            success: false,
                            statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                            message: "Failed to update OTP",
                        };
                    }
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
                const accessToken = (0, token_1.generateAccessToken)(user._id);
                const refreshToken = (0, token_1.generateRefreshToken)(user._id);
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
            const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
            if (!isOtpSent) {
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Failed to send OTP",
                };
            }
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
                yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
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
                const decodedRefreshToken = (0, token_1.verifyRefreshToken)(refreshToken);
                if (!decodedRefreshToken) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid refresh token",
                    };
                }
                const user = yield this.userRepository.findUserById(decodedRefreshToken.data);
                if (!user) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
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
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getSpecialisations();
        });
    }
    getExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experts = yield this.userRepository.getExperts();
                return experts;
            }
            catch (error) {
                console.error("Error in getAllExperts service:", error);
                throw error;
            }
        });
    }
    getExpertDetails(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_id) {
                    throw new Error("Expert ID is required");
                }
                const expert = yield this.userRepository.getExpertDetailsById(_id);
                if (!expert) {
                    throw new Error("User not found");
                }
                return expert;
            }
            catch (error) {
                console.error("Error in getExpertDetails service:", error);
                throw error;
            }
        });
    }
    checkSlotAvailability(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookedSlot = yield this.userRepository.findBookedSlot(slotId);
                if (bookedSlot && bookedSlot.consultation_status === "pending") {
                    return {
                        isAvailable: false,
                        message: "Slot already booked! Try another slot",
                    };
                }
                return {
                    isAvailable: true,
                    message: "Select payment method",
                };
            }
            catch (error) {
                console.error("Error in slot service checkSlotAvailability:", error);
                throw error;
            }
        });
    }
    initializeRazorpay() {
        try {
            const keyId = process.env.razorpay_key_id;
            const keySecret = process.env.razorpay_secret_id;
            if (!keyId || !keySecret) {
                throw new Error("Razorpay key_id or key_secret is missing in environment variables.");
            }
            this.razorpayInstance = new razorpay_1.default({
                key_id: keyId,
                key_secret: keySecret,
            });
        }
        catch (error) {
            console.error("Failed to initialize Razorpay:", error);
        }
    }
    createPaymentOrder(fee) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.razorpayInstance) {
                throw new Error("Razorpay is not properly initialized");
            }
            return new Promise((resolve, reject) => {
                const options = {
                    amount: fee * 100,
                    currency: "INR",
                    receipt: "razorUser@gmail.com",
                };
                this.razorpayInstance.orders.create(options, (err, order) => {
                    if (!err) {
                        resolve({
                            success: true,
                            fee: order.amount,
                            key_id: process.env.razorpay_key_id,
                            order_id: order.id,
                        });
                    }
                    else {
                        console.log("Razorpay failure case:", err);
                        reject({
                            success: false,
                            message: err || "Payment order creation failed",
                        });
                    }
                });
            });
        });
    }
    bookAppointment(farmerDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const slot = yield this.userRepository.findSlotById(farmerDetails.slotId);
                if (!slot) {
                    throw new Error("Slot not found");
                }
                if (slot.booked) {
                    throw new Error("Slot already booked");
                }
                const user = yield this.userRepository.findUserById(farmerDetails.userId);
                if (!user) {
                    throw new Error("User not found");
                }
                const userWallet = (_a = user.wallet) !== null && _a !== void 0 ? _a : 0;
                if (farmerDetails.payment_method === "wallet_payment") {
                    if (userWallet < slot.bookingAmount) {
                        throw new Error("Insufficient balance in wallet");
                    }
                    yield this.userRepository.updateUserWallet(user._id.toString(), -slot.bookingAmount);
                }
                yield this.userRepository.updateSlotBookingStatus(farmerDetails.slotId, true);
                yield this.userRepository.createBookedSlot(farmerDetails);
                const expertId = slot.expertId._id;
                yield notificationService_1.NotificationService.sendNotification(user._id.toString(), expertId.toString(), `Your slot booking for ${slot.time} is confirmed!`, "booking_success");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    cancelSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this.userRepository.findSlotByIdAndUpdate(slotId, {
                cancelled: true,
            });
            if (!slot) {
                throw new Error("Slot not found");
            }
            const bookedSlot = yield this.userRepository.findOneBookedSlotAndUpdate({ slotId }, { consultation_status: "cancelled" });
            if (!bookedSlot) {
                throw new Error("Booked slot not found");
            }
            const userId = bookedSlot.userId.toString();
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            yield this.userRepository.updateWallet(user._id.toString(), slot.bookingAmount);
            return { message: "Slot cancelled" };
        });
    }
}
exports.default = UserService;
