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
import SlotRepository from "../repositories/slot/slotRepository";
import SlotService from "../services/slot/slotService";
import SlotController from "../controllers/slot/slotController";
import PrescriptionRepository from "../repositories/prescription/prescriptionRepository";
import PrescriptionService from "../services/prescription/prescriptionService";
import PrescriptionController from "../controllers/prescription/prescriptionController";
import NotificationRepository from "../repositories/notification/notificationRepository";
import NotificationService from "../services/notification/notificationService";
import NotificationController from "../controllers/notification/notificationController";
import BookedSlotRepository from "../repositories/bookedSlot/bookedSlotRepository";
import BookedSlotService from "../services/bookedSlot/bookedSlotService";
import BookedSlotController from "../controllers/bookedSlot/bookedSlotController";

const userRouter = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

const slotRepository = new SlotRepository();
const slotService = new SlotService(slotRepository);
const slotController = new SlotController(slotService);

const prescriptionRepository = new PrescriptionRepository();
const prescriptionService = new PrescriptionService(prescriptionRepository);
const prescriptionController = new PrescriptionController(prescriptionService);

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const bookedSlotRepository = new BookedSlotRepository();
const bookedSlotService = new BookedSlotService(bookedSlotRepository);
const bookedSlotController = new BookedSlotController(bookedSlotService);

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
  slotController.getExpertSlots(req, res)
);

userRouter.post("/addSlots", userAuth, (req, res) =>
  slotController.addSlots(req, res)
);

userRouter.get("/getSlot", userAuth, (req, res) =>
  slotController.getSlot(req, res)
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
  bookedSlotController.getBookingDetails(req, res)
);

userRouter.get("/cancelSlot", (req, res) =>
  userController.cancelSlot(req, res)
);

userRouter.get("/upcoming_appointment", (req, res) =>
  bookedSlotController.upcomingAppointment(req, res)
);

userRouter.get("/getUpcomingSlot", (req, res) =>
  bookedSlotController.getUpcomingSlot(req, res)
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
  prescriptionController.getPrescriptionDetails(req, res)
);

userRouter.get("/notifications", (req, res) =>
  notificationController.getNotificationsForUser(req, res)
);
userRouter.put("/notifications/mark-as-read", (req, res) =>
  notificationController.markNotificationAsReadForUser(req, res)
);

userRouter.put("/notifications/clear", (req, res) =>
  notificationController.clearNotificationsForUser(req, res)
);

export default userRouter;
