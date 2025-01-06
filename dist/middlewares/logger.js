"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrors = logErrors;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define the path to the log file
const logFilePath = path_1.default.join(__dirname, '../error.log');
function logErrors(req, res, next) {
    // Store the original `res.send` method
    const originalSend = res.send;
    // Override `res.send` to capture and log error responses
    res.send = function (body) {
        // Check if the response status code indicates an error
        if (res.statusCode >= 400) {
            // Create a log message with request and response details
            const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${body}\n`;
            // Append the log message to the log file
            fs_1.default.appendFile(logFilePath, logMessage, (err) => {
                if (err)
                    console.error('Failed to write to log file:', err);
            });
        }
        // Call the original `res.send` method
        return originalSend.call(this, body);
    }; // Ensure the correct type is used
    // Proceed to the next middleware
    next();
}
