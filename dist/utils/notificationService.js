"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notificationModel_1 = require("../models/notificationModel");
class NotificationService {
    static initialize(io) {
        this.io = io;
        this.io.on("connection", (socket) => {
            // console.log("A user connected:", socket.id);
            // Listen for user authentication and store socket ID
            socket.on("register", (userId) => {
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
    static sendNotification(userId, expertId, message, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new notificationModel_1.Notification({
                    userId,
                    expertId,
                    message,
                    type,
                });
                yield notification.save();
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
                }
                else {
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
                }
                else {
                    // console.log(`Expert ${expertId} is offline. Notification saved.`);
                }
            }
            catch (error) {
                console.error("Error sending notification:", error);
            }
        });
    }
}
exports.NotificationService = NotificationService;
NotificationService.userSocketMap = new Map();
