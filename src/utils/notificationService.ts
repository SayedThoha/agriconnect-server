import { Server, Socket } from "socket.io";
import { Notification } from "../models/notificationModel";

export class NotificationService {
  private static io: Server;
  private static userSocketMap = new Map<string, string>();
  static initialize(io: Server) {
    this.io = io;

    this.io.on("connection", (socket: Socket) => {
      socket.on("register", (userId: string) => {
        this.userSocketMap.set(userId, socket.id);
        socket.join(userId);
      });

      socket.on("disconnect", () => {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === socket.id) {
            this.userSocketMap.delete(userId);
            break;
          }
        }
      });
    });
  }

  static async sendNotification(
    userId: string,
    expertId: string,
    message: string,
    type: string
  ) {
    try {
      const notification = new Notification({
        userId,
        expertId,
        message,
        type,
      });
      await notification.save();

      if (!this.io) {
        console.error("Socket.io not initialized!");
        return;
      }

      const userSocketId = this.userSocketMap.get(userId);
      if (userSocketId) {
        this.io.to(userSocketId).emit("notification", {
          message,
          type,
          createdAt: new Date(),
        });
      }

      const expertSocketId = this.userSocketMap.get(expertId);
      if (expertSocketId) {
        this.io.to(expertSocketId).emit("notification", {
          message,
          type,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
}
