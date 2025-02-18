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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware for admin token authentication
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("admin-Bearer")) {
        const token = authHeader.split(" ")[1]; // token from header
        const secret = process.env.JWT_SECRET || "default_secret";
        // console.log("Token received:", token);
        // console.log("JWT_SECRET during verification:", secret);
        try {
            jsonwebtoken_1.default.verify(token, secret, (err, admin) => {
                if (err || !admin) {
                    console.error("Error during token verification:", err);
                    return res.status(401).json({ message: "Unauthorized" });
                }
                if (typeof admin === "object" && "adminId" in admin) {
                    req.adminId = admin.adminId;
                    next();
                }
                else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            });
        }
        catch (error) {
            console.error("JWT verification error:", error);
            res.status(401).json({ message: "Unauthorized" });
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.default = adminAuth;
