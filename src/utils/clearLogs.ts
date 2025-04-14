import cron from "node-cron";
import fs from "fs";
import path from "path";
import Logger from "./logger";


const errorLogPath = path.join(__dirname, "../../logs/error.log");
const allLogPath = path.join(__dirname, "../../logs/all.log");


const clearLogs = () => {
  try {
    
    fs.truncateSync(errorLogPath, 0);
    fs.truncateSync(allLogPath, 0);

    Logger.info("Log files cleared successfully.");
  } catch (error) {
    Logger.error(`Failed to clear log files: ${error}`);
  }
};

cron.schedule("0 0 * * 0", () => {
  Logger.info("Running cron job to clear log files...");
  clearLogs();
});

export default clearLogs