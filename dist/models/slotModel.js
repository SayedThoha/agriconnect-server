"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slotschema = new mongoose_1.default.Schema({
    expertId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Expert",
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    booked: {
        type: Boolean,
        default: false,
    },
    bookingAmount: {
        type: Number,
        required: true,
    },
    adminPaymentAmount: {
        type: Number,
        required: true,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    created_time: {
        type: Date,
        default: Date.now(),
    },
});
exports.Slot = mongoose_1.default.model("Slot", slotschema);
