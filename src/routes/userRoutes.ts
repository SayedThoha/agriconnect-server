import express from "express";
import UserRepository from "../repositories/user/userRepository";

import UserController from "../controllers/user/userController";
import GoogleAuthRepository from "../repositories/googleAuth/googleAuthRepository";
import GoogleAuthService from "../services/googleAuthService";
import GoogleAuthController from "../controllers/googleAuthController";
import UserService from "../services/user/userService";
import { userAuth } from "../middlewares/userAuth";
import ChatController from "../controllers/chat/chatController";
import ChatRepository from "../repositories/chat/chatRepository";
import ChatService from "../services/chat/chatService";

// import { checkUserBlocked } from "../middlewares/userAuth";

const userRouter = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);



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

userRouter.post("/edit_user_profile_picture", (req, res) =>
  userController.editUserProfilePicture(req, res)
);

userRouter.get("/status/:id", userAuth, (req, res) =>
  userController.checkUserStatus(req, res)
);

userRouter.post("/verifyEmail", (req, res) =>
  userController.verifyEmailForPasswordReset(req, res)
);

userRouter.patch("/updatePassword", (req, res) =>
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

userRouter.get("/userAccessChat", (req, res) =>
  chatController.userAccessChat(req, res)
);
userRouter.get("/userFetchAllChat", (req, res) =>
  chatController.userFetchAllChat(req, res)
);
userRouter.post("/sendMessage", (req, res) =>
  chatController.sendMessage(req, res)
);
userRouter.get("/userFetchAllMessages", (req, res) =>
  chatController.userFetchAllMessages(req, res)
);

userRouter.get("/get_prescription_details", (req, res) =>
  userController.getPrescriptionDetails(req, res)
);

userRouter.get("/notifications", (req, res) =>
  userController.getNotifications(req, res)
);

userRouter.put("/notifications/mark-as-read", (req, res) =>
  userController.markNotificationAsRead(req, res)
);

userRouter.put("/notifications/clear", (req, res) =>
  userController.clearNotifications(req, res)
);

export default userRouter;
