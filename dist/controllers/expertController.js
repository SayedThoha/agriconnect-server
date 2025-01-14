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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
class ExpertController {
    constructor(expertService) {
        this.expertService = expertService;
        this.expertRegistration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("expert registration backend");
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
        this.getSpecialisation = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                console.log("entering the login in admin");
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
                res.status(result.statusCode).json(Object.assign(Object.assign(Object.assign({ success: result.success, message: result.message }, (result.accessToken && { accessToken: result.accessToken })), (result.accessedUser && { accessedUser: result.accessedUser })), (result.email && { email: result.email })));
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
}
exports.default = ExpertController;
