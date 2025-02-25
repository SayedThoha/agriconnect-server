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
                const missingFields = this.expertService.validateRegistrationData(req.body);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const result = yield this.expertService.registerExpert(req.body);
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
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
    getExpertBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Invalid query parameters",
                    });
                    return;
                }
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
    shareRoomIdThroughEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, slotId } = req.query;
                if (!roomId || !slotId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required field" });
                    return;
                }
                const response = yield this.expertService.shareRoomIdService(slotId, roomId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(response);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
                return;
            }
        });
    }
}
exports.default = ExpertController;
