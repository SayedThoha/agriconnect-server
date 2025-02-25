import { INotification } from "../../models/notificationModel";

export interface INotificationService{
    getNotificationsForUser(userId: string): Promise<INotification[]>;
    markNotificationAsReadForUser(userId: string): Promise<void>;
    clearNotificationsForUser(userId: string): Promise<void>;
    getNotificationsForExpert(expertId: string): Promise<INotification[]>;
    markNotificationAsReadForExpert(expertId: string): Promise<void>;
    clearNotificationsForExpert(expertId: string): Promise<void>;
}