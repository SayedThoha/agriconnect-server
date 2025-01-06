import cron from "node-cron";
import fs from "fs";
import path from "path";
import Logger from "./logger";

// Define the paths to the log files
const errorLogPath = path.join(__dirname, "../../logs/error.log");
const allLogPath = path.join(__dirname, "../../logs/all.log");

// Function to clear log files
const clearLogs = () => {
  try {
    // Truncate the log files to remove their contents
    fs.truncateSync(errorLogPath, 0);
    fs.truncateSync(allLogPath, 0);

    Logger.info("Log files cleared successfully.");
  } catch (error) {
    Logger.error(`Failed to clear log files: ${error}`);
  }
};

// Schedule the cron job
// This example runs every 7 days (every Sunday at midnight)
cron.schedule("0 0 * * 0", () => {
  Logger.info("Running cron job to clear log files...");
  clearLogs();
});

export default clearLogs