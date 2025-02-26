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
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const { firstName, lastName, email, password } = req.body;
                const result = yield this.userService.registerUser({
                    firstName,
                    lastName,
                    email,
                    password,
                });
                if (result.success) {
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
                const { _id, firstName, lastName, email } = req.body;
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
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const expert = yield this.userService.getExpertDetails(data._id);
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
    checkSlotAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slotId } = req.query;
                if (!slotId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "slot Id is missing" });
                    return;
                }
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
                const { consultation_fee } = req.body;
                if (!consultation_fee || consultation_fee <= 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid consultation fee",
                    });
                    return;
                }
                const paymentOrder = yield this.userService.createPaymentOrder(consultation_fee);
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
                const farmerDetails = req.body;
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
    cancelSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slotId } = req.query;
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
}
exports.default = UserController;
