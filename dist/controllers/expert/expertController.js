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
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class ExpertController {
    constructor(expertService) {
        this.expertService = expertService;
    }
    expertRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("expert registration backend", req.body);
                const missingFields = this.expertService.validateRegistrationData(req.body);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const result = yield this.expertService.registerExpert(req.body);
                console.log(result);
                if (!result.status) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: result.message });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({ message: result.message });
            }
            catch (error) {
                console.log("error due to expert registration:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getSpecialisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialisation = yield this.expertService.getSpecialisations();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ specialisation });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
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
                const result = yield this.expertService.resendOtp(email);
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
                const result = yield this.expertService.verifyOtp(email, otp, role, new_email);
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
                console.log("entering the login in expert");
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
                const result = yield this.expertService.loginExpert(email, password);
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
    getExpertDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Expert ID is required" });
                    return;
                }
                const expert = yield this.expertService.getExpertDetails(_id);
                if (!expert) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: "Expert not found" });
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expert);
            }
            catch (error) {
                console.error("Error in getExpertDetails controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    editExpertProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Edit profile of expert - server side");
                const data = req.body;
                if (!data._id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Expert ID is required" });
                    return;
                }
                const updatedExpert = yield this.expertService.editExpertProfile(data._id, {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contactno: data.contactno,
                    experience: data.experience,
                    consultation_fee: data.consultation_fee,
                });
                if (!updatedExpert) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                        .json({ message: "Expert not found" });
                    return;
                }
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "Profile updated successfully" });
            }
            catch (error) {
                console.error("Error in editExpertProfile controller:", error);
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
                const { expertId, email } = req.body;
                if (!expertId || !email) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "User ID and email are required" });
                    return;
                }
                const message = yield this.expertService.optForNewEmail(expertId, email);
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
    editExpertProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Raw Request Body:", req.body);
                const { expertId, image_url } = req.body;
                if (!expertId || !image_url) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required fields" });
                    return;
                }
                const message = yield this.expertService.editExpertProfilePicture(expertId, image_url);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message });
            }
            catch (error) {
                console.error("Error in editExpertProfilePicture controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    checkExpertStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expertId = req.params.id;
                console.log(expertId);
                const status = yield this.expertService.checkExpertStatus(expertId);
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
                yield this.expertService.verifyEmailForPasswordReset(email);
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
                const result = yield this.expertService.updatePassword(email, password);
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
                const response = yield this.expertService.refreshToken(refreshToken);
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
    createSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("add slot serverside");
                const data = req.body;
                console.log("data from adding slot", data);
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "Slot adding Failed, no data passed to server side",
                    });
                    return;
                }
                const result = yield this.expertService.createSlot(data);
                res.status(result.statusCode).json(result);
            }
            catch (error) {
                console.error("Error in createSlot controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal Server Error",
                });
            }
        });
    }
    addAllSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId, slots } = req.body;
                if (!expertId || !Array.isArray(slots) || slots.length === 0) {
                    res.status(400).json({ message: "Invalid input data" });
                    return;
                }
                const addedSlots = yield this.expertService.addAllSlots(expertId, slots);
                res.status(201).json(addedSlots);
            }
            catch (error) {
                console.error("Error adding slots:", error);
                res.status(500).json({ message: "Internal Server Error", error: error });
                return;
            }
        });
    }
    expertSlotDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (typeof _id !== "string") {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "slot adding Failed, Missing fields",
                    });
                    return;
                }
                const slots = yield this.expertService.getExpertSlotDetails(_id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(slots);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    removeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Slot ID is required" });
                    return;
                }
                const response = yield this.expertService.removeSlot(_id);
                res.status(response.statusCode).json({ message: response.message });
                return;
            }
            catch (error) {
                console.error("Error in removeSlot controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
                return;
            }
        });
    }
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get_booking_details serverside");
                const { expertId } = req.query;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const bookings = yield this.expertService.getBookingDetails(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(bookings);
            }
            catch (error) {
                console.error("Error fetching booking details:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getExpertDashboardDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "expert ID is required",
                    });
                    return;
                }
                const bookedSlots = yield this.expertService.getExpertDashboardDetails(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(bookedSlots);
            }
            catch (error) {
                console.error("Error in get dashboard controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    upcomingAppointment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching upcoming appointment from server...");
                const { expertId } = req.query;
                console.log("expert ID:", expertId);
                const appointment = yield this.expertService.getUpcomingAppointment(expertId);
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
    updateUpcomingSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const { appointmentId, roomId } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                const data = yield this.expertService.updateUpcomingSlot(appointmentId, roomId);
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
    updateSlotStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const { appointmentId, status } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                const data = yield this.expertService.updateSlotStatus(appointmentId, status);
                console.log("data:", data);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "consultation status updated" });
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getExpertBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get_bookings_of_details serverside");
                const { expertId } = req.query;
                console.log(expertId);
                // Validate query data
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Invalid query parameters",
                    });
                    return;
                }
                // Retrieve bookings
                const bookings = yield this.expertService.getExpertBookings(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(bookings);
            }
            catch (error) {
                console.error("Error fetching doctor bookings:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    addPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId, issue, prescription } = req.body;
                if (!appointmentId || !issue || !prescription) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required fields",
                    });
                    return;
                }
                // Add prescription
                const newPrescription = yield this.expertService.addPrescription(appointmentId, issue, prescription);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({
                    message: "Prescription added",
                    prescription: newPrescription,
                });
            }
            catch (error) {
                console.error("Error in addPrescription:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: error instanceof Error ? error.message : "Internal Server Error",
                });
            }
        });
    }
}
exports.default = ExpertController;
