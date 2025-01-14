"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpertBlocked = exports.expertAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expertModel_1 = require("../models/expertModel");
// expert token authentication middleware
const expertAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("expert-Bearer")) {
        res.status(401).json({ message: "Unauthorized" });
        return; // Ensure no further processing
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is not defined in the environment variables.");
        res.status(500).json({ message: "Internal Server Error" });
        return; // Ensure no further processing
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Check if decoded has the expertId property
        if (decoded && typeof decoded === "object" && "expertId" in decoded) {
            req.expertId = decoded.expertId; // Explicitly cast to string
            next();
        }
        else {
            res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }
    }
    catch (err) {
        console.error("JWT verification error:", err);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});
exports.expertAuth = expertAuth;
const checkExpertBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expertId } = req; // Assuming the expertId is set by a previous middleware
        if (!expertId) {
            res.status(400).json({ message: "Expert ID is missing" });
            return; // Ensure no further processing
        }
        const expert = yield expertModel_1.Expert.findById(expertId);
        if (expert && expert.blocked) {
            res.status(403).json({ message: "Expert is blocked" });
            return; // Ensure no further processing
        }
        next(); // Proceed to the next middleware
    }
    catch (error) {
        console.error("Error in checkExpertBlocked middleware:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.checkExpertBlocked = checkExpertBlocked;
