"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const scheduler_1 = require("./utils/scheduler");
(0, db_1.default)();
(0, scheduler_1.email_to_notify_booking_time)();
(0, scheduler_1.delete_unbooked_slots)();
(0, scheduler_1.update_unattended_slots)();
(0, scheduler_1.deleteClearedNotifications)();
app_1.default.listen(process.env.PORT, () => {
    console.log("server started");
});
