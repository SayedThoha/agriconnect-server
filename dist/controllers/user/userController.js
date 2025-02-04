"use strict";
//userController.ts
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
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Registering user...");
            try {
                // Validate required fields
                const requiredFields = ["firstName", "lastName", "email", "password"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                // Extract user data
                const { firstName, lastName, email, password } = req.body;
                // Call service to register user
                const result = yield this.userService.registerUser({
                    firstName,
                    lastName,
                    email,
                    password,
                });
                // Respond based on service result
                if (result.success) {
                    console.log("registration success");
                    res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({ message: result.message });
                }
                else {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: result.message });
                }
            }
            catch (error) {
                console.error("Error in registerUserController:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Server side error" });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate required fields
                const requiredFields = ["email"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        message: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email } = req.body;
                const result = yield this.userService.resendOtp(email);
                res.status(result.statusCode).json({
                    success: result.success,
                    message: result.message,
                });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate required fields
                const requiredFields = ["email", "otp"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        message: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email, otp, role, new_email } = req.body;
                const result = yield this.userService.verifyOtp(email, otp, role, new_email);
                res.status(result.statusCode).json({
                    success: result.success,
                    message: result.message,
                });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate required fields
                const requiredFields = ["email", "password"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        message: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email, password } = req.body;
                console.log(email, password);
                const result = yield this.userService.login(email, password);
                res.status(result.statusCode).json(Object.assign(Object.assign(Object.assign(Object.assign({ success: result.success, message: result.message }, (result.accessToken && { accessToken: result.accessToken })), (result.refreshToken && { refreshToken: result.refreshToken })), (result.accessedUser && { accessedUser: result.accessedUser })), (result.email && { email: result.email })));
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "User ID is required" });
                    return;
                }
                const user = yield this.userService.getUserDetails(_id);
                if (!user) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: "User not found" });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(user);
            }
            catch (error) {
                console.error("Error in getExpertDetails controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    editUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("editUserProfile backend");
                const { _id, firstName, lastName, email } = req.body;
                console.log(`id :${_id} firstName:${firstName} secondName:${lastName} email:${email}`);
                if (!_id || !firstName || !lastName || !email) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "All fields are required" });
                    return;
                }
                const updatedUser = yield this.userService.editUserProfile(_id, {
                    firstName,
                    lastName,
                    email,
                });
                if (!updatedUser) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: "User not found" });
                    return;
                }
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "profile updated sucessfully", data: updatedUser });
            }
            catch (error) {
                console.error("Error in editUserProfile controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    optForNewEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("optForNewEmail backend");
                const { userId, email } = req.body;
                if (!userId || !email) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "User ID and email are required" });
                    return;
                }
                const message = yield this.userService.optForNewEmail(userId, email);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                console.error("Error in optForNewEmail controller:", error);
                if (error.message === "Existing email. Try another") {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: error.message });
                }
                else {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                        .json({ message: "Internal Server Error" });
                }
            }
        });
    }
    editUserProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, image_url } = req.body;
                if (!userId || !image_url) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required fields" });
                    return;
                }
                const message = yield this.userService.editUserProfilePicture(userId, image_url);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message });
            }
            catch (error) {
                console.error("Error in editUserProfilePicture controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    checkUserStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                console.log(userId);
                const status = yield this.userService.checkUserStatus(userId);
                res.status(200).json(status);
            }
            catch (error) {
                console.error("Error in checkUserStatus:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    verifyEmailForPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Input validation
                const requiredFields = ["email"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email } = req.body;
                yield this.userService.verifyEmailForPasswordReset(email);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    message: "Email verification done",
                });
            }
            catch (error) {
                console.error("Email verification error:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal server error",
                });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation
                const requiredFields = ["email", "password"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email, password } = req.body;
                const result = yield this.userService.updatePassword(email, password);
                if (!result.status) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: result.message });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message: result.message });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal server error",
                });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                    success: false,
                    message: "Refresh token is required",
                });
                return;
            }
            try {
                // Call the refreshToken method from UserService
                const response = yield this.userService.refreshToken(refreshToken);
                res.status(response.statusCode).json(response);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
                return;
            }
        });
    }
    getSpecialisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialisation = yield this.userService.getSpecialisations();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(specialisation);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getExperts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expert = yield this.userService.getExperts();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expert);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getExpertDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                // console.log("hai hello",data);
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const expert = yield this.userService.getExpertDetails(data._id);
                console.log(expert);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expert);
            }
            catch (error) {
                console.error("Error in getExpertDetails controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getExpertSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const expert = yield this.userService.getExpertSlots(data._id);
                console.log(expert);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expert);
            }
            catch (error) {
                console.error("Error in getExpertSlotss controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    addSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("addSlots backend");
                const slotData = req.body;
                console.log(slotData);
                const updatedSlot = yield this.userService.bookSlot(slotData);
                console.log("slots after booking:", updatedSlot);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({
                    message: "slot updated",
                    slot: updatedSlot,
                });
            }
            catch (error) {
                console.error("Error in slot controller addSlots:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    getSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getSlot backend");
                const { slotId } = req.query;
                console.log("Query data:", { slotId });
                const slot = yield this.userService.getSlotDetails(slotId);
                console.log("Retrieved slot:", slot);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(slot);
            }
            catch (error) {
                console.error("Error in slot controller getSlot:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    checkSlotAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("check_if_the_slot_available backend");
                const { slotId } = req.query;
                if (!slotId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "slot Id is missing" });
                    return;
                }
                console.log("slotId:", slotId, req.query);
                const { isAvailable, message } = yield this.userService.checkSlotAvailability(slotId);
                if (!isAvailable) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.UNAUTHORIZED).json({ message });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message });
            }
            catch (error) {
                console.error("Error in slot controller checkSlotAvailability:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    createBookingPayment(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("booking_payment backend");
                const { consultation_fee } = req.body;
                if (!consultation_fee || consultation_fee <= 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid consultation fee",
                    });
                    return;
                }
                const paymentOrder = yield this.userService.createPaymentOrder(consultation_fee);
                console.log(paymentOrder);
                if (!paymentOrder.success) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json(paymentOrder);
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(paymentOrder);
            }
            catch (error) {
                console.error("Error in user controller createBookingPayment:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    appointmentBooking(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("appointmnet_booking backend");
                const farmerDetails = req.body;
                console.log(farmerDetails);
                yield this.userService.bookAppointment(farmerDetails);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.CREATED)
                    .json({ message: "Slot booking completed" });
            }
            catch (error) {
                console.error("Error in appointment booking:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    userDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                if (!userId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "User ID is required" });
                    return;
                }
                const user = yield this.userService.getUserDetails(userId);
                if (!user) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: "User not found" });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(user);
            }
            catch (error) {
                console.error("Error in userDetails controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get get_booking_details serverside");
                const { userId } = req.query;
                console.log("Query data:", { userId });
                if (!userId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                const bookedSlots = yield this.userService.getBookingDetails(userId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(bookedSlots);
            }
            catch (error) {
                console.error("Error in getBookingDetails controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    cancelSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get get_booking_details serverside");
                const { slotId } = req.query;
                console.log("Slot ID:", slotId);
                const response = yield this.userService.cancelSlot(slotId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(response);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json("Internal Server Error");
            }
        });
    }
    upcomingAppointment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching upcoming appointment from server...");
                const userId = req.query._id;
                console.log("User ID:", userId);
                const appointment = yield this.userService.getUpcomingAppointment(userId);
                if (Object.keys(appointment).length) {
                    console.log("Next appointment:", appointment);
                }
                else {
                    console.log("No upcoming appointments found.");
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(appointment);
            }
            catch (error) {
                console.error("Error fetching upcoming appointment:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getUpcomingSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const { appointmentId } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                const data = yield this.userService.getUpcomingSlot(appointmentId);
                console.log("data:", data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(data);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getPrescriptionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get_prescription_details:", req.query);
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required data" });
                    return;
                }
                const data = yield this.userService.getPrescriptionDetails(_id);
                console.log("Prescription details:", data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(data);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = UserController;
