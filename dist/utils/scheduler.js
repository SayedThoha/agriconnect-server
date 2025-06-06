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
exports.deleteClearedNotifications = exports.update_unattended_slots = exports.delete_unbooked_slots = exports.email_to_notify_booking_time = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const node_cron_1 = __importDefault(require("node-cron"));
const slotModel_1 = require("../models/slotModel");
const bookeSlotModel_1 = require("../models/bookeSlotModel");
const sendNotification_1 = require("./sendNotification");
const userModel_1 = require("../models/userModel");
const notificationModel_1 = require("../models/notificationModel");
const email_to_notify_booking_time = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("50,20 8-20 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookedSlots = yield bookeSlotModel_1.BookedSlot.find({
                consultation_status: "pending",
            })
                .populate("slotId")
                .populate("userId")
                .populate("expertId");
            const now = new Date();
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
            const upcomingSlot = bookedSlots.filter((slot) => {
                const slotTime = new Date(slot.slotId.time);
                return slotTime >= now && slotTime <= tenMinutesFromNow;
            });
            if (upcomingSlot.length > 0) {
                upcomingSlot.forEach((slot) => {
                    (0, sendNotification_1.update_slot_time_through_email)(slot.userId.email, slot.expertId.email);
                });
            }
        }
        catch (err) {
            console.error("Error cleaning up find slot for email generation:", err);
        }
    }));
});
exports.email_to_notify_booking_time = email_to_notify_booking_time;
const delete_unbooked_slots = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0,30 9-20 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            yield slotModel_1.Slot.deleteMany({
                time: { $lt: now },
                booked: false,
                cancelled: false,
            });
        }
        catch (err) {
            console.error("Error cleaning up past slots:", err);
        }
    }));
});
exports.delete_unbooked_slots = delete_unbooked_slots;
const update_unattended_slots = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0,30 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60000);
            const unattendedSlots = yield bookeSlotModel_1.BookedSlot.find({
                consultation_status: "pending",
            })
                .populate("slotId")
                .populate("userId");
            const slotsToUpdate = unattendedSlots.filter((slot) => {
                const slotTime = new Date(slot.slotId.time);
                return slotTime < oneHourAgo;
            });
            if (slotsToUpdate.length > 0) {
                for (const slot of slotsToUpdate) {
                    const user = slot.userId;
                    const slotDetails = slot.slotId;
                    const refundAmount = slotDetails.bookingAmount || 0;
                    if (refundAmount > 0) {
                        yield userModel_1.User.findByIdAndUpdate(user._id, {
                            $inc: { wallet: refundAmount },
                        });
                    }
                    yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate(slot._id, {
                        consultation_status: "not_consulted",
                    });
                }
            }
        }
        catch (err) {
            console.error("Error updating unattended booked slots:", err);
        }
    }));
});
exports.update_unattended_slots = update_unattended_slots;
const deleteClearedNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield notificationModel_1.Notification.deleteMany({
                isClearedByUser: true,
                isClearedByExpert: true,
            });
        }
        catch (error) {
            console.error("Error deleting cleared notifications:", error);
        }
    }));
});
exports.deleteClearedNotifications = deleteClearedNotifications;
