"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expert = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../constants/enum");
const expertSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactno: { type: Number, required: true },
    profile_picture: { type: String, required: true },
    specialisation: { type: String, required: true },
    current_working_address: { type: String, required: true },
    experience: { type: String, required: true },
    consultation_fee: { type: Number, required: true },
    qualification_certificate: [{ type: String, required: true }],
    experience_certificate: [{ type: String, required: true }],
    expert_licence: { type: String, required: true },
    identity_proof_type: { type: String, required: true },
    identity_proof: { type: String, required: true },
    password: { type: String, required: true },
    kyc_verification: { type: Boolean, default: enum_1.enumForStatus[1] },
    blocked: { type: Boolean, default: enum_1.enumForStatus[1] },
    created_time: { type: Date, default: Date.now },
    otp: { type: String, required: true },
    otp_update_time: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false },
    role: { type: String, default: "expert" },
}, { timestamps: true });
exports.Expert = mongoose_1.default.model("Expert", expertSchema);
