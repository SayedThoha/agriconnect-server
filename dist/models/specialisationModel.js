"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Specialisation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const specialisationSchema = new mongoose_1.default.Schema({
    specialisation: {
        type: String,
        required: true,
    },
});
exports.Specialisation = mongoose_1.default.model("Specialisation", specialisationSchema);
