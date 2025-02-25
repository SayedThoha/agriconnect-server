import { INotification } from "../../models/notificationModel";
import NotificationRepository from "../../repositories/notification/notificationRepository";
import { INotificationService } from "./INotificationService";

class NotificationService implements INotificationService{
    constructor(private notificationRepository:NotificationRepository){
}
//user
 async getNotificationsForUser(userId: string): Promise<INotification[]> {
    try {
      const notifications = await this.notificationRepository.getNotificationsForUser(userId);
      return notifications;
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }

  async markNotificationAsReadForUser(userId: string): Promise<void> {
    try {
      await this.notificationRepository.markNotificationAsReadForUser(userId);
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }

  async clearNotificationsForUser(userId: string): Promise<void> {
    try {
      await this.notificationRepository.clearNotificationsForUser(userId);
    } catch (error) {
      console.error("Error in clearing notifications (Service):", error);
      throw error;
    }
  }

  // expert

  async getNotificationsForExpert(expertId: string): Promise<INotification[]> {
    try {
      const notifications = await this.notificationRepository.getNotificationsForExpert(
        expertId
      );

      return notifications;
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }

  
  async markNotificationAsReadForExpert(expertId: string): Promise<void> {
    try {
      await this.notificationRepository.markNotificationAsReadForExpert(expertId);
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }


  async clearNotificationsForExpert(expertId: string): Promise<void> {
    try {
      await this.notificationRepository.clearNotificationsForExpert(expertId);
    } catch (error) {
      console.error("Error in clearing notifications (Service):", error);
      throw error;
    }
  }
}

export default NotificationService