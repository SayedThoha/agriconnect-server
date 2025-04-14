import express from "express";
import http from "http";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";
import expertRouter from "./routes/expertRoutes";
import adminRouter from "./routes/adminRoutes";
import cors from "cors";
import morganMiddleware from "./middlewares/loggerMiddleware";
import imageRouter from "./routes/imageRouter";
import clearLogs from "./utils/clearLogs";
import { Server } from "socket.io";
import { NotificationService } from "./utils/notificationService";

const app = express();
const server = http.createServer(app);

dotenv.config();

clearLogs();

const io = new Server(server, {
  pingTimeout: 10000,
  cors: {
    origin: ["http://localhost:4200", "https://agriconnect-zeta.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

NotificationService.initialize(io);

app.use(
  cors({
    origin: ["http://localhost:4200", "https://agriconnect-zeta.vercel.app"],
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

io.on("connection", (socket) => {
  socket.on("newMessage", (data) => {
    io.emit("messageReceived", data);
  });
});

export default server;
