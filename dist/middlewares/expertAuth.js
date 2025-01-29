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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpertBlocked = exports.expertAuth = void 0;
// import jwt, { JwtPayload } from "jsonwebtoken";
const expertModel_1 = require("../models/expertModel");
const token_1 = require("../utils/token");
// expert token authentication middleware
const expertAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("expert-Bearer")) {
        res.status(401).json({ message: "Unauthorized" });
        return; // Ensure no further processing
    }
    const token = authHeader.split(" ")[1];
    try {
        // const decoded = jwt.verify(token, secret) as JwtPayload;
        const decoded = yield (0, token_1.verifyToken)(token);
        // Check if decoded has the expertId property
        if (decoded && typeof decoded === "object" && "data" in decoded) {
            req.expertId = decoded.data; // Explicitly cast to string
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
