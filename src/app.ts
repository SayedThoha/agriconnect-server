//app.ts
import express from "express";
import http from "http";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";

import expertRouter from "./routes/expertRoutes";
import adminRouter from "./routes/adminRoutes";
import bodyParser from "body-parser";
import cors from "cors";

import morganMiddleware from "./middlewares/loggerMiddleware";
// import errorHandler from "./middlewares/errorHandler";
// import clearLogs from "./utils/clearLogs";

const app = express();
const server = http.createServer(app);

dotenv.config();
// clearLogs()


app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
  
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleware);

app.use("/user", userRouter);
app.use("/expert", expertRouter);
app.use("/admin", adminRouter);

// Mock error route
// app.get("/error", (req, res, next) => {
//   const error = new Error("This is a mocked error for testing purposes.");
//   next(error); // Pass error to error handling middleware
// });

// app.use(errorHandler);

export default server;
