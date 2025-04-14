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
class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getNotificationsForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                if (!userId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                const notification = yield this.notificationService.getNotificationsForUser(userId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(notification);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    markNotificationAsReadForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                yield this.notificationService.markNotificationAsReadForUser(userId);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "Notifications marked as read" });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    clearNotificationsForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    res.status(400).json({ message: "User ID is required" });
                    return;
                }
                yield this.notificationService.clearNotificationsForUser(userId);
                res.status(200).json({ message: "All notifications cleared" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    getNotificationsForExpert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                const notification = yield this.notificationService.getNotificationsForExpert(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(notification);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    markNotificationAsReadForExpert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.body;
                if (!expertId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                yield this.notificationService.markNotificationAsReadForExpert(expertId);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "Notifications marked as read" });
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    clearNotificationsForExpert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.body;
                if (!expertId) {
                    res.status(400).json({ message: "Expert ID is required" });
                    return;
                }
                yield this.notificationService.clearNotificationsForExpert(expertId);
                res.status(200).json({ message: "All notifications cleared" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = NotificationController;
