"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../repositories/user/userRepository"));
const userController_1 = __importDefault(require("../controllers/user/userController"));
const googleAuthRepository_1 = __importDefault(require("../repositories/googleAuth/googleAuthRepository"));
const googleAuthService_1 = __importDefault(require("../services/googleAuthService"));
const googleAuthController_1 = __importDefault(require("../controllers/googleAuthController"));
const userService_1 = __importDefault(require("../services/user/userService"));
const userAuth_1 = require("../middlewares/userAuth");
const chatController_1 = __importDefault(require("../controllers/chat/chatController"));
const chatRepository_1 = __importDefault(require("../repositories/chat/chatRepository"));
const chatService_1 = __importDefault(require("../services/chat/chatService"));
const slotRepository_1 = __importDefault(require("../repositories/slot/slotRepository"));
const slotService_1 = __importDefault(require("../services/slot/slotService"));
const slotController_1 = __importDefault(require("../controllers/slot/slotController"));
const prescriptionRepository_1 = __importDefault(require("../repositories/prescription/prescriptionRepository"));
const prescriptionService_1 = __importDefault(require("../services/prescription/prescriptionService"));
const prescriptionController_1 = __importDefault(require("../controllers/prescription/prescriptionController"));
const notificationRepository_1 = __importDefault(require("../repositories/notification/notificationRepository"));
const notificationService_1 = __importDefault(require("../services/notification/notificationService"));
const notificationController_1 = __importDefault(require("../controllers/notification/notificationController"));
const bookedSlotRepository_1 = __importDefault(require("../repositories/bookedSlot/bookedSlotRepository"));
const bookedSlotService_1 = __importDefault(require("../services/bookedSlot/bookedSlotService"));
const bookedSlotController_1 = __importDefault(require("../controllers/bookedSlot/bookedSlotController"));
const userRouter = express_1.default.Router();
const userRepository = new userRepository_1.default();
const userService = new userService_1.default(userRepository);
const userController = new userController_1.default(userService);
const chatRepository = new chatRepository_1.default();
const chatService = new chatService_1.default(chatRepository);
const chatController = new chatController_1.default(chatService);
const slotRepository = new slotRepository_1.default();
const slotService = new slotService_1.default(slotRepository);
const slotController = new slotController_1.default(slotService);
const prescriptionRepository = new prescriptionRepository_1.default();
const prescriptionService = new prescriptionService_1.default(prescriptionRepository);
const prescriptionController = new prescriptionController_1.default(prescriptionService);
const notificationRepository = new notificationRepository_1.default();
const notificationService = new notificationService_1.default(notificationRepository);
const notificationController = new notificationController_1.default(notificationService);
const bookedSlotRepository = new bookedSlotRepository_1.default();
const bookedSlotService = new bookedSlotService_1.default(bookedSlotRepository);
const bookedSlotController = new bookedSlotController_1.default(bookedSlotService);
const googleAuthRepository = new googleAuthRepository_1.default(process.env.GOOGLE_CLIENT_ID, userRepository);
const googleAuthService = new googleAuthService_1.default(googleAuthRepository);
const googleAuthController = new googleAuthController_1.default(googleAuthService);
userRouter.post("/userRegister", (req, res) => userController.registerUser(req, res));
userRouter.post("/resendOtp", (req, res) => userController.resendOtp(req, res));
userRouter.post("/verifyOtp", (req, res) => userController.verifyOtp(req, res));
userRouter.post("/login", (req, res) => userController.login(req, res));
userRouter.post("/googleLogin", (req, res) => googleAuthController.login(req, res));
userRouter.get("/getuserDetails", userAuth_1.userAuth, (req, res) => userController.getUserDetails(req, res));
userRouter.post("/editUserProfile_name", (req, res) => userController.editUserProfile(req, res));
userRouter.post("/opt_for_new_email", (req, res) => userController.otpForNewEmail(req, res));
userRouter.post("/edit_user_profile_picture", (req, res) => userController.editUserProfilePicture(req, res));
userRouter.get("/status/:id", userAuth_1.userAuth, (req, res) => userController.checkUserStatus(req, res));
userRouter.post("/verifyEmail", (req, res) => userController.verifyEmailForPasswordReset(req, res));
userRouter.patch("/updatePassword", (req, res) => userController.updatePassword(req, res));
userRouter.post("/auth/refresh-token", (req, res) => userController.refreshToken(req, res));
userRouter.get("/getSpecialisation", (req, res) => userController.getSpecialisation(req, res));
userRouter.get("/getExperts", (req, res) => userController.getExperts(req, res));
userRouter.get("/getExpertDetails", userAuth_1.userAuth, (req, res) => userController.getExpertDetails(req, res));
userRouter.get("/getSlots", userAuth_1.userAuth, (req, res) => slotController.getExpertSlots(req, res));
userRouter.post("/addSlots", userAuth_1.userAuth, (req, res) => slotController.addSlots(req, res));
userRouter.get("/getSlot", userAuth_1.userAuth, (req, res) => slotController.getSlot(req, res));
userRouter.get("/check_if_the_slot_available", userAuth_1.userAuth, (req, res) => userController.checkSlotAvailability(req, res));
userRouter.post("/booking_payment", (req, res) => userController.createBookingPayment(req, res));
userRouter.post("/appointment_booking", (req, res) => userController.appointmentBooking(req, res));
userRouter.get("/userDetails", (req, res) => userController.userDetails(req, res));
userRouter.get("/cancelSlot", (req, res) => userController.cancelSlot(req, res));
userRouter
    .use(userAuth_1.userAuth)
    .get("/get_booking_details", (req, res) => bookedSlotController.getBookingDetails(req, res))
    .get("/upcoming_appointment", (req, res) => bookedSlotController.upcomingAppointment(req, res))
    .get("/getUpcomingSlot", (req, res) => bookedSlotController.getUpcomingSlot(req, res));
userRouter
    .use(userAuth_1.userAuth)
    .get("/userAccessChat", (req, res) => chatController.userAccessChat(req, res))
    .get("/userFetchAllChat", (req, res) => chatController.userFetchAllChat(req, res))
    .post("/sendMessage", (req, res) => chatController.sendMessage(req, res))
    .get("/userFetchAllMessages", (req, res) => chatController.userFetchAllMessages(req, res));
userRouter
    .use(userAuth_1.userAuth)
    .get("/get_prescription_details", (req, res) => prescriptionController.getPrescriptionDetails(req, res));
userRouter
    .use(userAuth_1.userAuth)
    .get("/notifications", (req, res) => notificationController.getNotificationsForUser(req, res))
    .put("/notifications/mark-as-read", (req, res) => notificationController.markNotificationAsReadForUser(req, res))
    .put("/notifications/clear", (req, res) => notificationController.clearNotificationsForUser(req, res));
exports.default = userRouter;
