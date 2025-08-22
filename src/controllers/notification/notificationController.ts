import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { Request, Response } from "express";
import { INotificationController } from "./INotificationController";
import { INotificationService } from "../../services/notification/INotificationService";

class NotificationController implements INotificationController {
  constructor(private notificationService: INotificationService) {}
  async getNotificationsForUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      if (!userId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      const notification =
        await this.notificationService.getNotificationsForUser(
          userId as string
        );
      res.status(Http_Status_Codes.OK).json(notification);
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
  async markNotificationAsReadForUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      await this.notificationService.markNotificationAsReadForUser(
        userId as string
      );
      res
        .status(Http_Status_Codes.OK)
        .json({ message: "Notifications marked as read" });
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
  async clearNotificationsForUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      await this.notificationService.clearNotificationsForUser(
        userId as string
      );
      res.status(200).json({ message: "All notifications cleared" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getNotificationsForExpert(req: Request, res: Response): Promise<void> {
    try {
      const { expertId } = req.query;
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      const notification =
        await this.notificationService.getNotificationsForExpert(
          expertId as string
        );
      res.status(Http_Status_Codes.OK).json(notification);
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
  async markNotificationAsReadForExpert(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { expertId } = req.body;
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      await this.notificationService.markNotificationAsReadForExpert(
        expertId as string
      );
      res
        .status(Http_Status_Codes.OK)
        .json({ message: "Notifications marked as read" });
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
  async clearNotificationsForExpert(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { expertId } = req.body;

      if (!expertId) {
        res.status(400).json({ message: "Expert ID is required" });
        return;
      }
      await this.notificationService.clearNotificationsForExpert(
        expertId as string
      );
      res.status(200).json({ message: "All notifications cleared" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default NotificationController;
