"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../repositories/user/userRepository"));
const userService_1 = __importDefault(require("../services/userService"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = express_1.default.Router();
const userRepository = new userRepository_1.default();
const userService = new userService_1.default(userRepository);
const userController = new userController_1.default(userService);
// userRouter.post("/register", (req, res) =>
//   userController.registerUserController(req, res)
// );
userRouter.post('/userRegister', (req, res) => userController.registerUserController(req, res));
userRouter.post('/resendOtp', (req, res) => userController.resendOtp(req, res));
userRouter.post('/verifyOtp', (req, res) => userController.verifyOtp(req, res));
userRouter.post('/login', (req, res) => userController.login(req, res));
exports.default = userRouter;
