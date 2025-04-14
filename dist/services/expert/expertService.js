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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable  @typescript-eslint/no-explicit-any */
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const hashPassword_1 = require("../../utils/hashPassword");
const otp_1 = require("../../utils/otp");
const sendOtpToMail_1 = require("../../utils/sendOtpToMail");
const token_1 = require("../../utils/token");
const sendRoomId_1 = require("../../utils/sendRoomId");
class ExpertService {
    constructor(expertRepository) {
        this.expertRepository = expertRepository;
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
            yield this.expertRepository.createKyc(expert._id.toString(), expert);
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
                const otp = (0, otp_1.generateOtp)();
                const updatedExpert = yield this.expertRepository.updateExpertOtp(email, otp);
                if (!updatedExpert) {
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
                const expert = yield this.expertRepository.findByEmail(email);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                if (expert.otp !== otp) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect OTP",
                    };
                }
                const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
                const timeDifference = Math.floor((new Date().getTime() - expert.otp_update_time.getTime()) / 1000);
                if (timeDifference > otpExpirySeconds) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "OTP Expired",
                    };
                }
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
                const expert = yield this.expertRepository.findByEmail(email);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid username",
                    };
                }
                const passwordMatch = yield (0, hashPassword_1.comparePass)(password, expert.password);
                if (!passwordMatch) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Incorrect password",
                    };
                }
                if (expert.blocked === true) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.FORBIDDEN,
                        message: "Your account is blocked by Admin",
                    };
                }
                if (expert.is_verified === false) {
                    const otp = (0, otp_1.generateOtp)();
                    const updatedExpert = yield this.expertRepository.updateExpertOtpDetails(expert._id.toString(), otp);
                    if (!updatedExpert) {
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
                const accessToken = (0, token_1.generateAccessToken)(expert._id);
                const refreshToken = (0, token_1.generateRefreshToken)(expert._id);
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
    getExpertDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this.expertRepository.findById(id);
            if (!expert) {
                throw new Error("Expert not found");
            }
            return expert;
        });
    }
    editExpertProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !updateData) {
                throw new Error("Expert ID and update data are required");
            }
            return this.expertRepository.updateExpertProfile(id, updateData);
        });
    }
    optForNewEmail(expertId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId || !email) {
                throw new Error("Expert ID and email are required");
            }
            const expert = yield this.expertRepository.findById(expertId);
            if (!expert) {
                throw new Error("expert not found");
            }
            if (expert.email === email) {
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
            yield this.expertRepository.updateExpertById(expertId, {
                otp: otp,
                otp_update_time: new Date(),
            });
            return "otp sent to mail";
        });
    }
    editExpertProfilePicture(expertId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId || !imageUrl) {
                throw new Error("Missing required fields");
            }
            yield this.expertRepository.updateProfilePicture(expertId, imageUrl);
            return "Profile picture updated successfully";
        });
    }
    checkExpertStatus(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.expertRepository.checkExpertStatus(expertId);
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
                const expert = yield this.expertRepository.findByEmail(email);
                if (!expert) {
                    throw new Error("Invalid Email");
                }
                const otp = (0, otp_1.generateOtp)();
                yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
                yield this.expertRepository.updateExpertOtp(email, otp);
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
                const user = yield this.expertRepository.updatePassword(email, hashedPassword);
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
                const expert = yield this.expertRepository.findById(decodedRefreshToken.data);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                const newAccessToken = (0, token_1.generateAccessToken)(expert._id);
                const newRefreshToken = (0, token_1.generateRefreshToken)(expert._id);
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
    convertToLocalDate(date) {
        const utcDate = new Date(date);
        return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    }
    getBookingDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield this.expertRepository.getBookingDetails(expertId);
                return bookings;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to fetch booking details");
            }
        });
    }
    getExpertDashboardDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!expertId) {
                    throw new Error("User ID is required");
                }
                const bookings = yield this.expertRepository.getExpertDashboardDetails(expertId);
                return bookings;
            }
            catch (error) {
                console.error("Error in getBookingDetails service:", error);
                throw error;
            }
        });
    }
    getExpertBookings(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId) {
                throw new Error("Expert ID is required");
            }
            try {
                const slotIds = yield this.expertRepository.findBookedSlotsByExpert(expertId);
                if (slotIds.length === 0) {
                    return [];
                }
                const bookedSlots = yield this.expertRepository.findBookedSlotsBySlotIds(slotIds, expertId);
                return bookedSlots;
            }
            catch (error) {
                console.error("Error in getExpertBookings:", error);
                throw new Error("Failed to retrieve expertbookings");
            }
        });
    }
    shareRoomIdService(slotId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this.expertRepository.updateRoomIdForSlot(slotId, roomId);
            if (!slot) {
                throw new Error("Slot not found");
            }
            const userEmail = yield this.expertRepository.getUserEmailFromSlot(slot);
            if (!userEmail) {
                throw new Error("User email not found");
            }
            yield (0, sendRoomId_1.generateMailForRoomId)(userEmail, roomId);
            return { message: `Room ID sent to user's email.` };
        });
    }
}
exports.default = ExpertService;
