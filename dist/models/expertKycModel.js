"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertKyc = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../constants/enum");
const expertKycschema = new mongoose_1.default.Schema({
    expertId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Expert",
        required: true,
    },
    exp_certificate: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    qualification_certificate: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    liscence: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    id_proof_type: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    id_proof: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    specialisation: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    curr_work_details: {
        type: String,
        default: enum_1.enumForKycVerification[1],
    },
    created_time: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true });
exports.ExpertKyc = mongoose_1.default.model("expertKyccollection", expertKycschema);
