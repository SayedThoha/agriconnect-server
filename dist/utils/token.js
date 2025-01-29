"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const generateAccessToken = (payload) => {
    const token = jsonwebtoken_1.default.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn: "5m" });
    return token;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const token = jsonwebtoken_1.default.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn: "48h" });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        const secret = `${process.env.JWT_SECRET}`;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.log("Error while jwt token verification", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    try {
        const secret = `${process.env.JWT_SECRET}`;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
