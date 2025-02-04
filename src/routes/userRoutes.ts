import express from "express";
import UserRepository from "../repositories/user/userRepository";

import UserController from "../controllers/user/userController";
import GoogleAuthRepository from "../repositories/googleAuth/googleAuthRepository";
import GoogleAuthService from "../services/googleAuthService";
import GoogleAuthController from "../controllers/googleAuthController";
import UserServices from "../services/user/userService";
import { userAuth } from "../middlewares/userAuth";


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

userRouter.get("/getuserDetails", userAuth, (req, res) =>
  userController.getUserDetails(req, res)
);

userRouter.post("/editUserProfile_name", (req, res) =>
  userController.editUserProfile(req, res)
);

userRouter.post("/opt_for_new_email", (req, res) =>
  userController.optForNewEmail(req, res)
);

userRouter.post( "/edit_user_profile_picture",(req, res) => userController.editUserProfilePicture(req, res)
);

userRouter.get("/status/:id", userAuth, (req, res) =>
  userController.checkUserStatus(req, res)
);

userRouter.post("/verifyEmail", (req, res) =>
  userController.verifyEmailForPasswordReset(req, res)
);

userRouter.post("/updatePassword", (req, res) =>
  userController.updatePassword(req, res)
);

userRouter.post("/auth/refresh-token", (req, res) =>
  userController.refreshToken(req, res)
);

userRouter.get("/getSpecialisation", (req, res) =>
  userController.getSpecialisation(req, res)
);

userRouter.get("/getExperts", (req, res) =>
  userController.getExperts(req, res)
);

userRouter.get("/getExpertDetails", userAuth, (req, res) =>
  userController.getExpertDetails(req, res)
);

userRouter.get("/getSlots", userAuth, (req, res) =>
  userController.getExpertSlots(req, res)
);

userRouter.post("/addSlots", userAuth, (req, res) =>
  userController.addSlots(req, res)
);

userRouter.get("/getSlot", userAuth, (req, res) =>
  userController.getSlot(req, res)
);

userRouter.get("/check_if_the_slot_available", userAuth, (req, res) =>
  userController.checkSlotAvailability(req, res)
);

userRouter.post("/booking_payment", (req, res) =>
  userController.createBookingPayment(req, res)
);
userRouter.post("/appointment_booking", (req, res) =>
  userController.appointmentBooking(req, res)
);
userRouter.get("/userDetails", (req, res) =>
  userController.userDetails(req, res)
);
userRouter.get("/get_booking_details", (req, res) =>
  userController.getBookingDetails(req, res)
);

userRouter.get("/cancelSlot", (req, res) =>
  userController.cancelSlot(req, res)
);

userRouter.get("/upcoming_appointment", (req, res) =>
  userController.upcomingAppointment(req, res)
);

userRouter.get("/getUpcomingSlot", (req, res) =>
  userController.getUpcomingSlot(req, res)
);

userRouter.get("/get_prescription_details", (req, res) =>
  userController.getPrescriptionDetails(req, res)
);
export default userRouter;
