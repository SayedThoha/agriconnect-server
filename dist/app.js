"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//app.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const expertRoutes_1 = __importDefault(require("./routes/expertRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
// import errorHandler from "./middlewares/errorHandler";
// import clearLogs from "./utils/clearLogs";
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
// clearLogs()
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(loggerMiddleware_1.default);
app.use("/user", userRoutes_1.default);
app.use("/expert", expertRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
// Mock error route
app.get("/error", (req, res, next) => {
    const error = new Error("This is a mocked error for testing purposes.");
    next(error); // Pass error to error handling middleware
});
// app.use(errorHandler);
exports.default = server;
