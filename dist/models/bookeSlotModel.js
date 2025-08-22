"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookedSlot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookedSlotSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slotId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Slot",
        required: true,
    },
    expertId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Expert",
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    payment_status: {
        type: Boolean,
        default: false,
    },
    consultation_status: {
        type: String,
        default: "pending",
    },
    farmer_details: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
        },
        reason_for_visit: {
            type: String,
        },
    },
    created_time: {
        type: Date,
        default: Date.now(),
    },
    roomId: {
        type: String,
    },
    prescription_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Prescription",
    },
});
exports.BookedSlot = mongoose_1.default.model("BookedSlot", bookedSlotSchema);
