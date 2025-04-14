"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const errorLogPath = path_1.default.join(__dirname, "../../logs/error.log");
const allLogPath = path_1.default.join(__dirname, "../../logs/all.log");
const clearLogs = () => {
    try {
        fs_1.default.truncateSync(errorLogPath, 0);
        fs_1.default.truncateSync(allLogPath, 0);
        logger_1.default.info("Log files cleared successfully.");
    }
    catch (error) {
        logger_1.default.error(`Failed to clear log files: ${error}`);
    }
};
node_cron_1.default.schedule("0 0 * * 0", () => {
    logger_1.default.info("Running cron job to clear log files...");
    clearLogs();
});
exports.default = clearLogs;
