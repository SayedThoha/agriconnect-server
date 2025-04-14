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
exports.checkUserBlocked = exports.userAuth = void 0;
const userModel_1 = require("../models/userModel");
const token_1 = require("../utils/token");
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("user-Bearer")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = yield (0, token_1.verifyToken)(token);
            if (!decoded) {
                res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid or expired token" });
                return;
            }
            if (decoded && typeof decoded === "object" && "data" in decoded) {
                req.userId = decoded.data;
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
        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
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
