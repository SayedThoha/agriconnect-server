import express from "express";
import UserRepository from "../repositories/user/userRepository";
import UserServices from "../services/userService";
import UserController from "../controllers/userController";
import GoogleAuthRepository from "../repositories/googleAuth/googleAuthRepository";
import GoogleAuthService from "../services/googleAuthService";
import GoogleAuthController from "../controllers/googleAuthController";

// import { checkUserBlocked } from "../middlewares/userAuth";

const userRouter = express.Router();

const userRepository = new UserRepository();
const userService = new UserServices(userRepository);
const userController = new UserController(userService);

const googleAuthRepository = new GoogleAuthRepository(
  process.env.GOOGLE_CLIENT_ID!,
  userRepository
);
const googleAuthService = new GoogleAuthService(googleAuthRepository);
const googleAuthController = new GoogleAuthController(googleAuthService);

userRouter.post("/userRegister", (req, res) =>
  userController.registerUser(req, res)
);

userRouter.post("/resendOtp", (req, res) => userController.resendOtp(req, res));

userRouter.post("/verifyOtp", (req, res) => userController.verifyOtp(req, res));

userRouter.post("/login", (req, res) => userController.login(req, res));

userRouter.post("/googleLogin", (req, res) =>
  googleAuthController.login(req, res)
);

userRouter.get("/getuserDetails", (req, res) =>
  userController.getUserDetails(req, res)
);

userRouter.post("/editUserProfile_name", (req, res) =>
  userController.editUserProfile(req, res)
);

userRouter.post("/opt_for_new_email", (req, res) =>
  userController.optForNewEmail(req, res)
);

userRouter.post("/edit_user_profile_picture", (req, res) =>
  userController.editUserProfilePicture(req, res)
);

export default userRouter;
