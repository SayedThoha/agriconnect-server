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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationModel_1 = require("../../models/notificationModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class NotificationRepository extends baseRepository_1.default {
    constructor() {
        super(notificationModel_1.Notification);
    }
    getNotificationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.Notification.find({
                    userId,
                    isClearedByUser: false,
                })
                    .sort({
                    createdAt: -1,
                })
                    .populate({
                    path: "expertId",
                    select: "firstName lastName",
                });
                return notifications;
            }
            catch (error) {
                console.error("Error in notification repository:", error);
                throw error;
            }
        });
    }
    markNotificationAsReadForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationModel_1.Notification.updateMany({ userId, isReadByUser: false }, { $set: { isReadByUser: true } });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    clearNotificationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationModel_1.Notification.updateMany({ userId, isClearedByUser: false }, { $set: { isClearedByUser: true } });
            }
            catch (error) {
                console.error("Error in clearing notifications (Repository):", error);
                throw error;
            }
        });
    }
    getNotificationsForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.Notification.find({
                    expertId,
                    isClearedByExpert: false,
                })
                    .sort({
                    createdAt: -1,
                })
                    .populate({
                    path: "userId",
                    select: "firstName lastName",
                });
                return notifications;
            }
            catch (error) {
                console.error("Error in notification repository:", error);
                throw error;
            }
        });
    }
    markNotificationAsReadForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationModel_1.Notification.updateMany({ expertId, isReadByExpert: false }, { $set: { isReadByExpert: true } });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    clearNotificationsForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationModel_1.Notification.updateMany({ expertId, isClearedByExpert: false }, { $set: { isClearedByExpert: true } });
            }
            catch (error) {
                console.error("Error in clearing notifications (Repository):", error);
                throw error;
            }
        });
    }
}
exports.default = NotificationRepository;
