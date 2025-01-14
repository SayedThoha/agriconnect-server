"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otp_update_time: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    blocked: { type: Boolean, default: false },
    created_time: { type: Date, default: Date.now },
    wallet: { type: Number, default: 0 },
    profile_picture: { type: String, default: null },
    googleId: { type: String },
    authProvider: { type: String, default: "local" },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
