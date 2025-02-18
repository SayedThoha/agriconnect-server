//index.ts
import server from "./app";
import connectDB from "./config/db";
import {
  delete_unbooked_slots,
  deleteClearedNotifications,
  email_to_notify_booking_time,
  update_unattended_slots,
} from "./utils/scheduler";

connectDB();
email_to_notify_booking_time();
delete_unbooked_slots();
update_unattended_slots();
deleteClearedNotifications();

server.listen(process.env.PORT, () => {
  console.log("server started");
});
