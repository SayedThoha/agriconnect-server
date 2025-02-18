/* eslint-disable @typescript-eslint/no-explicit-any */
import cron from "node-cron";
import { Slot } from "../models/slotModel";
import { BookedSlot } from "../models/bookeSlotModel";
import { update_slot_time_through_email } from "./sendNotification";
import { User } from "../models/userModel";
import { Notification } from "../models/notificationModel";

export const email_to_notify_booking_time = async () => {
  // console.log("email_to_notify_booking_time_to user and expert");
  cron.schedule("50,20 8-20 * * *", async () => {
    // console.log("Running task every 30 minutes from 8:50 AM to 8:20 PM");
    try {
      const bookedSlots = await BookedSlot.find({
        consultation_status: "pending",
      })
        .populate("slotId")
        .populate("userId")
        .populate("expertId");

      const now = new Date();
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

      // Filter the slots after populating
      const upcomingSlot = bookedSlots.filter((slot) => {
        const slotTime = new Date((slot.slotId as any).time);
        return slotTime >= now && slotTime <= tenMinutesFromNow;
      });

      if (upcomingSlot.length > 0) {
        upcomingSlot.forEach((slot) => {
          update_slot_time_through_email(
            (slot.userId as any).email,
            (slot.expertId as any).email
          );
        });
      }
    } catch (err) {
      console.error("Error cleaning up find slot for email generation:", err);
    }
  });
};

export const delete_unbooked_slots = async () => {
  // console.log("delete_unbooked_slots");
  cron.schedule("0,30 9-20 * * *", async () => {
    // console.log("Running task every 30 minutes from 9:00 AM to 8:30 PM");
    try {
      // Get the current date and time
      const now = new Date();
      // Find and delete slots that have a time in the past
      // const result =
      await Slot.deleteMany({
        time: { $lt: now },
        booked: false,
        cancelled: false,
      });
      // console.log("result:", result);
      // console.log(`Deleted ${result.deletedCount} past slots`);
    } catch (err) {
      console.error("Error cleaning up past slots:", err);
    }
  });
};

export const update_unattended_slots = async () => {
  cron.schedule("0,30 * * * *", async () => {
    // Runs every 30 minutes
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60000); // 1 hour ago

      const unattendedSlots = await BookedSlot.find({
        consultation_status: "pending",
      })
        .populate("slotId")
        .populate("userId");

      // Filter slots where scheduled time was more than an hour ago
      const slotsToUpdate = unattendedSlots.filter((slot) => {
        const slotTime = new Date((slot.slotId as any).time);
        return slotTime < oneHourAgo;
      });

      if (slotsToUpdate.length > 0) {
        for (const slot of slotsToUpdate) {
          const user = slot.userId as any;
          const slotDetails = slot.slotId as any;

          const refundAmount = slotDetails.bookingAmount || 0; // Get booking amount

          // Refund the booking amount to the user's wallet
          if (refundAmount > 0) {
            await User.findByIdAndUpdate(user._id, {
              $inc: { wallet: refundAmount },
            });

            // console.log(`Refunded ${refundAmount} to user ${user.email}`);
          }

          // Update the slot status
          await BookedSlot.findByIdAndUpdate(slot._id, {
            consultation_status: "not_consulted",
          });
        }
      }
    } catch (err) {
      console.error("Error updating unattended booked slots:", err);
    }
  });
};

export const deleteClearedNotifications = async () => {
  cron.schedule("0 0 * * *", async () => {
    // Runs every day at midnight
    try {
      // console.log("Running scheduled notification cleanup...");

      // const deletedNotifications =
      await Notification.deleteMany({
        isClearedByUser: true,
        isClearedByExpert: true,
      });

      // console.log(
      //   `Deleted ${deletedNotifications.deletedCount} cleared notifications`
      // );
    } catch (error) {
      console.error("Error deleting cleared notifications:", error);
    }
  });
};
