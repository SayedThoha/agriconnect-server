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
class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    //user
    getNotificationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.notificationRepository.getNotificationsForUser(userId);
                return notifications;
            }
            catch (error) {
                console.error("Error in notification service:", error);
                throw error;
            }
        });
    }
    markNotificationAsReadForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notificationRepository.markNotificationAsReadForUser(userId);
            }
            catch (error) {
                console.error("Error in notification service:", error);
                throw error;
            }
        });
    }
    clearNotificationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notificationRepository.clearNotificationsForUser(userId);
            }
            catch (error) {
                console.error("Error in clearing notifications (Service):", error);
                throw error;
            }
        });
    }
    // expert
    getNotificationsForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.notificationRepository.getNotificationsForExpert(expertId);
                return notifications;
            }
            catch (error) {
                console.error("Error in notification service:", error);
                throw error;
            }
        });
    }
    markNotificationAsReadForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notificationRepository.markNotificationAsReadForExpert(expertId);
            }
            catch (error) {
                console.error("Error in notification service:", error);
                throw error;
            }
        });
    }
    clearNotificationsForExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notificationRepository.clearNotificationsForExpert(expertId);
            }
            catch (error) {
                console.error("Error in clearing notifications (Service):", error);
                throw error;
            }
        });
    }
}
exports.default = NotificationService;
