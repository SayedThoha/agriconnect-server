"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const expertRoutes_1 = __importDefault(require("./routes/expertRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cors_1 = __importDefault(require("cors"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const imageRouter_1 = __importDefault(require("./routes/imageRouter"));
const clearLogs_1 = __importDefault(require("./utils/clearLogs"));
const socket_io_1 = require("socket.io");
const notificationService_1 = require("./utils/notificationService");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
(0, clearLogs_1.default)();
const io = new socket_io_1.Server(server, {
    pingTimeout: 10000,
    cors: {
        origin: ["http://localhost:4200", "https://agriconnect-zeta.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
notificationService_1.NotificationService.initialize(io);
app.use((0, cors_1.default)({
    origin: ["http://localhost:4200", "https://agriconnect-zeta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(loggerMiddleware_1.default);
app.use("/user", userRoutes_1.default);
app.use("/expert", expertRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/image", imageRouter_1.default);
io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
        io.emit("messageReceived", data);
    });
});
exports.default = server;
