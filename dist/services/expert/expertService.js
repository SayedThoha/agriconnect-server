"use strict";
/* eslint-disable @typescript-eslint/no-empty-object-type */
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
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const hashPassword_1 = require("../../utils/hashPassword");
const otp_1 = require("../../utils/otp");
const sendOtpToMail_1 = require("../../utils/sendOtpToMail");
const token_1 = require("../../utils/token");
const mongoose_1 = __importDefault(require("mongoose"));
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
                // Check if expert is blocked
                if (expert.blocked === true) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.FORBIDDEN,
                        message: "Your account is blocked by Admin",
                    };
                }
                // Check if expert is verified
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
                // const accessToken = jwt.sign({ expertId: expert._id }, this.jwtSecret);
                const accessToken = (0, token_1.generateAccessToken)(expert._id);
                const refreshToken = (0, token_1.generateRefreshToken)(expert._id);
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
            // Send OTP
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
                // Send OTP
                const isOtpSent = yield (0, sendOtpToMail_1.sentOtpToEmail)(email, otp);
                if (!isOtpSent) {
                    {
                        console.log("otp not send");
                    }
                }
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
                // Validate refresh token
                const decodedRefreshToken = (0, token_1.verifyRefreshToken)(refreshToken); // This method will decode and validate the refresh token
                // console.log(decodedRefreshToken)
                if (!decodedRefreshToken) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED,
                        message: "Invalid refresh token",
                    };
                }
                // Find the user based on decoded token
                const expert = yield this.expertRepository.findById(decodedRefreshToken.data);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "User not found",
                    };
                }
                // Generate new access token and refresh token
                const newAccessToken = (0, token_1.generateAccessToken)(expert._id);
                // console.log("new accesstoken", newAccessToken);
                const newRefreshToken = (0, token_1.generateRefreshToken)(expert._id);
                // console.log("newRefresh token", newRefreshToken);
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
    //slot
    convertToLocalDate(date) {
        const utcDate = new Date(date);
        return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    }
    createSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert dates
                const slotLocalDate = this.convertToLocalDate(slotData.time);
                const currentLocalDate = this.convertToLocalDate(new Date());
                // Check if slot exists
                const existingSlot = yield this.expertRepository.findSlotByExpertIdAndTime(slotData._id, slotData.time);
                if (existingSlot) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.CONFLICT,
                        message: "Slot already exists",
                    };
                }
                if (slotLocalDate <= currentLocalDate) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.CONFLICT,
                        message: "The selected slot is no longer available",
                    };
                }
                // Get required data
                const [admin, expert] = yield Promise.all([
                    this.expertRepository.findAdminSettings(),
                    this.expertRepository.findById(slotData._id),
                ]);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "Expert not found",
                    };
                }
                // Convert string ID to ObjectId
                const expertObjectId = new mongoose_1.default.Types.ObjectId(slotData._id);
                // Create slot data
                const newSlotData = {
                    expertId: expertObjectId,
                    time: slotData.time,
                    booked: false,
                    cancelled: false,
                    adminPaymentAmount: admin[0].payOut,
                    bookingAmount: expert.consultation_fee,
                    created_time: new Date(),
                };
                // Create slot
                const slot = yield this.expertRepository.createSlot(newSlotData);
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.CREATED,
                    message: "Slot created successfully",
                    data: slot,
                };
            }
            catch (error) {
                console.error("Error in createSlot:", error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: error instanceof Error ? error.message : "Error creating slot",
                };
            }
        });
    }
    addAllSlots(expertId, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId || !slots.length) {
                throw new Error("Expert ID and slots are required");
            }
            const [admin, expert] = yield Promise.all([
                this.expertRepository.findAdminSettings(),
                this.expertRepository.findById(expertId),
            ]);
            console.log(admin);
            if (!admin || !expert) {
                throw new Error("Admin or expert not found");
            }
            const slotData = slots.map((time) => ({
                expertId: new mongoose_1.default.Types.ObjectId(expertId),
                time,
                adminPaymentAmount: admin[0].payOut,
                bookingAmount: expert.consultation_fee,
                booked: false,
                cancelled: false,
                created_time: new Date(),
            }));
            return this.expertRepository.createMultipleSlots(slotData);
        });
    }
    getExpertSlotDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            console.log(expertId);
            try {
                return yield this.expertRepository.findSlotsByExpertId(expertId, currentTime);
            }
            catch (error) {
                throw new Error(`Error fetching expert slot details: ${error}`);
            }
        });
    }
    removeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Removing slot with ID:", slotId);
                // Find slot
                const slot = yield this.expertRepository.findSlotById(slotId);
                if (!slot) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "Slot not found",
                    };
                }
                // Check if slot is booked
                if (slot.booked) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "Slot is already booked and cannot be removed.",
                    };
                }
                // Delete slot
                yield this.expertRepository.deleteSlotById(slotId);
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Slot successfully deleted",
                };
            }
            catch (error) {
                console.error("Error in removeSlot:", error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: error instanceof Error ? error.message : "Error deleting slot",
                };
            }
        });
    }
    getBookingDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield this.expertRepository.getBookingDetails(expertId);
                console.log("booked slots:", bookings);
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
    getUpcomingAppointment(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fetching upcoming appointments...");
            const now = new Date();
            const margin = 15 * 60 * 1000; // 15 minutes in milliseconds
            const bookedSlots = yield this.expertRepository.findPendingAppointmentsByExpert(expertId);
            console.log("Booked Slots:", bookedSlots);
            // Filter appointments that are upcoming
            const upcomingAppointments = bookedSlots.filter((slot) => {
                if (!slot.slotId ||
                    typeof slot.slotId !== "object" ||
                    !("time" in slot.slotId)) {
                    console.error("Invalid slotId:", slot.slotId);
                    return false;
                }
                const slotTime = new Date(slot.slotId.time);
                return slotTime.getTime() > now.getTime() - margin;
            });
            // Sort to get the nearest upcoming appointment
            upcomingAppointments.sort((a, b) => new Date(a.slotId.time).getTime() -
                new Date(b.slotId.time).getTime());
            return upcomingAppointments[0] || {};
        });
    }
    updateUpcomingSlot(appointmentId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.expertRepository.findSlotByIdAndUpdate(appointmentId, roomId);
            if (!data) {
                throw new Error("Appointment not found");
            }
            return data;
        });
    }
    updateSlotStatus(appointmentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.expertRepository.findSlotByIdAndUpdateStatus(appointmentId, status);
            if (!data) {
                throw new Error("Appointment not found");
            }
            return data;
        });
    }
    getExpertBookings(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            if (!expertId) {
                throw new Error("Expert ID is required");
            }
            try {
                // Find booked slots for the expert
                const slotIds = yield this.expertRepository.findBookedSlotsByExpert(expertId);
                console.log("slots to display in slot adding page:", slotIds.length);
                // If no slots, return empty array
                if (slotIds.length === 0) {
                    return [];
                }
                // Find booked slots for these slots
                const bookedSlots = yield this.expertRepository.findBookedSlotsBySlotIds(slotIds, expertId);
                console.log("Booked slots:", bookedSlots.length);
                return bookedSlots;
            }
            catch (error) {
                console.error("Error in getDoctorBookings:", error);
                throw new Error("Failed to retrieve doctor bookings");
            }
        });
    }
    addPrescription(appointmentId, issue, prescription) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            if (!appointmentId || !issue || !prescription) {
                throw new Error("Missing required fields");
            }
            try {
                // Verify the booked slot belongs to the expert
                const bookedSlot = yield this.expertRepository.findBookedSlotById(appointmentId);
                if (!bookedSlot) {
                    throw new Error("Appointment not found");
                }
                // Create prescription
                const newPrescription = yield this.expertRepository.createPrescription({
                    bookedSlot: appointmentId,
                    issue,
                    prescription,
                });
                // console.log("prescription:", newPrescription);
                // Update booked slot with prescription ID
                yield this.expertRepository.updateBookedSlotWithPrescription(appointmentId, newPrescription._id);
                return newPrescription;
            }
            catch (error) {
                console.error("Error adding prescription:", error);
                throw new Error("Failed to add prescription");
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
    getPrescriptionDetails(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.expertRepository.findPrescriptionById(prescriptionId);
            if (!data) {
                throw new Error("Prescription not found");
            }
            return data;
        });
    }
}
exports.default = ExpertService;
