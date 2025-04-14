"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    expertId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Expert",
        required: true,
    },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isReadByUser: { type: Boolean, default: false },
    isReadByExpert: { type: Boolean, default: false },
    isClearedByUser: { type: Boolean, default: false },
    isClearedByExpert: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.Notification = mongoose_1.default.model("Notification", notificationSchema);
