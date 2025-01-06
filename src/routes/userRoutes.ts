import express from "express";
import UserRepository from "../repositories/user/userRepository";
import UserServices from "../services/userService";
import UserController from "../controllers/userController";

const userRouter = express.Router();


const userRepository = new UserRepository();
const userService = new UserServices(userRepository);
const userController = new UserController(userService);

// userRouter.post("/register", (req, res) =>
//   userController.registerUserController(req, res)
// );
userRouter.post('/userRegister', (req, res) =>
  
  userController.registerUserController(req, res)
);

userRouter.post('/resendOtp', (req, res) =>
  userController.resendOtp(req, res)
);

userRouter.post('/verifyOtp', (req, res) =>
  userController.verifyOtp(req, res)
);

userRouter.post('/login', (req, res) => 
  userController.login(req, res)
)
export default userRouter;
