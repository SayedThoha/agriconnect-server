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
exports.checkUserBlocked = exports.userAuth = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("user-Bearer")) {
        const token = authHeader.split(" ")[1]; // Getting token from the header
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in the environment variables.");
            res.status(500).json({ message: "Internal Server Error" });
            return; // Ensure no further processing
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Check if decoded has the expertId property
            if (decoded && typeof decoded === "object" && "userId" in decoded) {
                req.userId = decoded.userId; // Explicitly cast to string
                next();
            }
            else {
                res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid token payload" });
            }
        }
        catch (err) {
            console.error("JWT verification error:", err);
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    }
});
exports.userAuth = userAuth;
const checkUserBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        // Assuming the user ID is stored in req.user
        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return; // Ensure no further processing
        }
        const user = yield userModel_1.User.findById(userId);
        if (user && user.blocked) {
            res.status(403).json({ message: "User is blocked" });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.checkUserBlocked = checkUserBlocked;
