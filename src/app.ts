//app.ts
import express from "express";
import http from "http";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";
// import helmet from "helmet";

import expertRouter from "./routes/expertRoutes";
import adminRouter from "./routes/adminRoutes";

import cors from "cors";

import morganMiddleware from "./middlewares/loggerMiddleware";
import imageRouter from "./routes/imageRouter";
// import errorHandler from "./middlewares/errorHandler";
import clearLogs from "./utils/clearLogs";
import { Server } from "socket.io";
import { NotificationService } from "./utils/notificationService";

const app = express();
const server = http.createServer(app);

dotenv.config();

// app.use(helmet());

clearLogs();

const io = new Server(server, {
  pingTimeout: 10000,
  cors: {
    origin: ["http://localhost:4200", process.env.FRONTEND_URL || ""],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

NotificationService.initialize(io);

app.use(
  cors({
    origin: ["http://localhost:4200", process.env.FRONTEND_URL || ""],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);

app.use("/user", userRouter);
app.use("/expert", expertRouter);
app.use("/admin", adminRouter);
app.use("/image", imageRouter);

// app.use(errorHandler);

io.on("connection", (socket) => {
  // console.log("A user connected");
  socket.on("newMessage", (data) => {
    // console.log("newMessage in socketIO:", data);

    io.emit("messageReceived", data);
  });
});

export default server;
