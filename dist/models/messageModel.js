"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel",
    },
    senderModel: {
        type: String,
        required: true,
        enum: ["User", "Expert"],
    },
    content: {
        type: String,
        required: true,
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
}, {
    timestamps: true,
});
exports.Message = mongoose_1.default.model("Message", messageSchema);
