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
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requiredFields = ["email", "password"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { email, password } = req.body;
                const result = yield this.adminService.validateLogin(email, password);
                res
                    .status(result.status)
                    .json(result.success ? result.data : { message: result.message });
            }
            catch (error) {
                console.error("Admin login error:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getAdminDashboardDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userCount, expertCount, slotDetails } = yield this.adminService.getAdminDashboardDetails();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    user_count: userCount,
                    expert_count: expertCount,
                    slotDetails: slotDetails,
                });
            }
            catch (error) {
                console.error("Error in getAdminDashboardDetails:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getExperts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expert } = req.query;
                if (expert === "all") {
                    const expertData = yield this.adminService.getAllExperts();
                    res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expertData);
                    return;
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                    message: "Invalid expert type specified",
                });
            }
            catch (error) {
                console.error("Error in getExperts controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.adminService.getAllUsers();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(userData);
            }
            catch (error) {
                console.error("Error in getUsers controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getSpecialisations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialisationData = yield this.adminService.getAllSpecialisations();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(specialisationData);
            }
            catch (error) {
                console.error("Error in getSpecializations controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    addSpecialisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Submission Failed",
                    });
                    return;
                }
                yield this.adminService.addSpecialisation(data);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({
                    message: "Specialisation added Successfully",
                });
            }
            catch (error) {
                console.error("Error in addSpecialisation controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    editSpecialisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Edit Failed",
                    });
                    return;
                }
                yield this.adminService.editSpecialisation(data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    message: "Edit Successfully",
                });
            }
            catch (error) {
                console.error("Error in editSpecialization controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Specialization not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "Specialization not found",
                        });
                        return;
                    }
                    if (error.message === "Invalid specialization data") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Invalid data provided",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    deleteSpecialisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                if (!data || !data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Delete Failed - ID is required",
                    });
                    return;
                }
                yield this.adminService.deleteSpecialisation(data._id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    message: "Delete Successfully",
                });
            }
            catch (error) {
                console.error("Error in deleteSpecialization controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Specialization not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "Specialization not found",
                        });
                        return;
                    }
                    if (error.message === "Specialization ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Invalid specialization ID",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    toggleBlockStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                yield this.adminService.toggleUserBlockStatus(data._id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    message: "Status changed successfully",
                });
            }
            catch (error) {
                console.error("Error in toggleBlockStatus controller:", error);
                if (error instanceof Error) {
                    if (error.message === "User not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "User not found",
                        });
                        return;
                    }
                    if (error.message === "User ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "User ID is required",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const user = yield this.adminService.getUserDetails(data._id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(user);
            }
            catch (error) {
                console.error("Error in getUserDetails controller:", error);
                if (error instanceof Error) {
                    if (error.message === "User not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "User not found",
                        });
                        return;
                    }
                    if (error.message === "User ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "User ID is required",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "No data to search",
                    });
                    return;
                }
                const results = yield this.adminService.searchUsers(data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(results);
            }
            catch (error) {
                console.error("Error in searchUsers controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Search term is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Search term is required",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    searchExperts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "No data to search",
                    });
                    return;
                }
                const results = yield this.adminService.searchExperts(data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(results);
            }
            catch (error) {
                console.error("Error in searchUsers controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Search term is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Search term is required",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    toggleExpertStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requiredFields = ["_id"];
                const missingFields = requiredFields.filter((field) => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        error: `Missing required fields: ${missingFields.join(", ")}`,
                    });
                    return;
                }
                const { _id } = req.body;
                yield this.adminService.toggleExpertStatus(_id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({
                    message: "Expert status of block changed",
                });
            }
            catch (error) {
                console.error("Error in toggleExpertStatus controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Expert not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "Expert not found",
                        });
                        return;
                    }
                    if (error.message === "Expert ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Expert ID is required",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getKycData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kycData = yield this.adminService.getPendingKycData();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(kycData);
            }
            catch (error) {
                console.error("Error in getKycData controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    getExpertKycDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Fetching doctor ID Failed",
                    });
                    return;
                }
                const kycDetails = yield this.adminService.getExpertKycDetails(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(kycDetails);
            }
            catch (error) {
                console.error("Error in getExpertKycDetails controller:", error);
                if (error instanceof Error) {
                    if (error.message === "Expert ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "Expert ID is required",
                        });
                        return;
                    }
                    if (error.message === "KYC details not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "KYC details not found",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    submitKycDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Fetching expert ID Failed",
                    });
                    return;
                }
                const result = yield this.adminService.submitKycDetails(data);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(result);
            }
            catch (error) {
                console.error("Error in submitKycDetails controller:", error);
                if (error instanceof Error) {
                    if (error.message === "KYC ID is required") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                            message: "KYC ID is required",
                        });
                        return;
                    }
                    if (error.message === "KYC details not found") {
                        res.status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND).json({
                            message: "KYC details not found",
                        });
                        return;
                    }
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    downloadKycDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId, name, index } = req.query;
                if (!expertId || !name) {
                    return res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Fetching data to download failed" });
                }
                const destinationPath = yield this.adminService.downloadDocument({
                    expertId,
                    name,
                    index: typeof index === "string" ? parseInt(index, 10) : undefined,
                });
                return res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "Downloaded Successfully", path: destinationPath });
            }
            catch (error) {
                console.error("Error in downloadKycDocuments:", error);
                if (error instanceof Error) {
                    switch (error.message) {
                        case "Expert not found":
                            return res
                                .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                                .json({ message: "Expert not found" });
                        case "File not found":
                            return res
                                .status(httpStatusCodes_1.Http_Status_Codes.NOT_FOUND)
                                .json({ message: "File not found" });
                        case "File copy failed":
                            return res
                                .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                                .json({ message: "Error copying file" });
                    }
                }
                return res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    editPayOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data || !data.payOut) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Edit payout failed. Invalid data." });
                    return;
                }
                const message = yield this.adminService.editPayOut(data.payOut);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json({ message });
            }
            catch (error) {
                console.error("Error during editPayOut:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error ." });
            }
        });
    }
    getAppointmentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield this.adminService.getAppointmentDetails();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(appointments);
            }
            catch (error) {
                console.error("Error fetching appointment details:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = AdminController;
