"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    payOut: {
        type: Number,
        default: 100,
    },
}, { timestamps: true });
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
