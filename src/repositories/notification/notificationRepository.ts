import { Notification, INotification } from "../../models/notificationModel";
import BaseRepository from "../base/baseRepository";
import { INotificationRepository } from "./INotificationRepository";

class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async getNotificationsForUser(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({
        userId,
        isClearedByUser: false,
      })
        .sort({
          createdAt: -1,
        })
        .populate({
          path: "expertId",
          select: "firstName lastName",
        });
      return notifications;
    } catch (error) {
      console.error("Error in notification repository:", error);
      throw error;
    }
  }
  async markNotificationAsReadForUser(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { userId, isReadByUser: false },
        { $set: { isReadByUser: true } }
      );
    } catch (error) {
      console.error(error);
    }
  }
  async clearNotificationsForUser(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { userId, isClearedByUser: false },
        { $set: { isClearedByUser: true } }
      );
    } catch (error) {
      console.error("Error in clearing notifications (Repository):", error);
      throw error;
    }
  }

  async getNotificationsForExpert(expertId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({
        expertId,
        isClearedByExpert: false,
      })
        .sort({
          createdAt: -1,
        })
        .populate({
          path: "userId",
          select: "firstName lastName",
        });
      return notifications;
    } catch (error) {
      console.error("Error in notification repository:", error);
      throw error;
    }
  }

  async markNotificationAsReadForExpert(expertId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { expertId, isReadByExpert: false },
        { $set: { isReadByExpert: true } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async clearNotificationsForExpert(expertId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { expertId, isClearedByExpert: false },
        { $set: { isClearedByExpert: true } }
      );
    } catch (error) {
      console.error("Error in clearing notifications (Repository):", error);
      throw error;
    }
  }
}

export default NotificationRepository;
