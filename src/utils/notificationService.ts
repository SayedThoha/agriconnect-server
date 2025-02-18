import { Server, Socket } from "socket.io";
import { Notification } from "../models/notificationModel";

export class NotificationService {
  private static io: Server;
  private static userSocketMap = new Map<string, string>();
  static initialize(io: Server) {
    this.io = io;

    this.io.on("connection", (socket: Socket) => {
      // console.log("A user connected:", socket.id);

      // Listen for user authentication and store socket ID
      socket.on("register", (userId: string) => {
        // console.log(`User registered for notifications: ${userId}`);
        this.userSocketMap.set(userId, socket.id);
        socket.join(userId); // Ensure user joins their own room
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        // console.log(`User disconnected: ${socket.id}`);
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

        // console.log(`Notification sent to user ${userId}`, {
        //   message,
        //   type,
        //   createdAt: new Date(),
        // });
      } else {
        // console.log(`User ${userId} is offline. Notification saved.`);
      }

      // Send notification to the expert
      const expertSocketId = this.userSocketMap.get(expertId);
      if (expertSocketId) {
        this.io.to(expertSocketId).emit("notification", {
          message,
          type,
          createdAt: new Date(),
        });
        // console.log(`Notification sent to expert ${expertId}`, {
        //   message,
        //   type,
        //   createdAt: new Date(),
        // });
      } else {
        // console.log(`Expert ${expertId} is offline. Notification saved.`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
  
}
