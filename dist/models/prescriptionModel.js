"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prescription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prescriptionSchema = new mongoose_1.default.Schema({
    bookedSlot: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "BookedSlot",
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// module.exports = mongoose.model("prescriptionCollection", prescriptionSchema);
exports.Prescription = mongoose_1.default.model("Prescription", prescriptionSchema);
