"use strict";
/* eslint-disable  @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res) {
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
    });
    res.status(res.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}
exports.default = errorHandler;
