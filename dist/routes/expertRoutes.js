"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expertRepository_1 = __importDefault(require("../repositories/expert/expertRepository"));
const expertService_1 = __importDefault(require("../services/expert/expertService"));
const expertController_1 = __importDefault(require("../controllers/expert/expertController"));
const multer_1 = __importDefault(require("../utils/multer"));
const expertAuth_1 = require("../middlewares/expertAuth");
const chatRepository_1 = __importDefault(require("../repositories/chat/chatRepository"));
const chatService_1 = __importDefault(require("../services/chat/chatService"));
const chatController_1 = __importDefault(require("../controllers/chat/chatController"));
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
const expertRouter = express_1.default.Router();
const expertRepository = new expertRepository_1.default();
const expertService = new expertService_1.default(expertRepository);
const expertController = new expertController_1.default(expertService);
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
expertRouter.post("/registration", multer_1.default.fields([
    { name: "identity_proof", maxCount: 1 },
    { name: "expert_licence", maxCount: 1 },
    { name: "profile_picture", maxCount: 1 },
    { name: "qualification_certificate" },
    { name: "experience_certificate" },
]), (req, res) => expertController.expertRegistration(req, res));
expertRouter.get("/specialisation", (req, res) => expertController.getSpecialisation(req, res));
expertRouter.post("/resendOtp", (req, res) => expertController.resendOtp(req, res));
expertRouter.post("/verifyOtp", (req, res) => expertController.verifyOtp(req, res));
expertRouter.post("/login", (req, res) => expertController.login(req, res));
expertRouter.get("/getExpertDetails", expertAuth_1.expertAuth, (req, res) => expertController.getExpertDetails(req, res));
expertRouter.post("/editExpertProfile", expertAuth_1.expertAuth, (req, res) => expertController.editExpertProfile(req, res));
expertRouter.post("/opt_for_new_email", expertAuth_1.expertAuth, (req, res) => expertController.optForNewEmail(req, res));
expertRouter.post("/edit_expert_profile_picture", expertAuth_1.expertAuth, (req, res) => expertController.editExpertProfilePicture(req, res));
expertRouter.get("/status/:id", expertAuth_1.expertAuth, (req, res) => expertController.checkExpertStatus(req, res));
expertRouter.post("/verifyEmail", (req, res) => expertController.verifyEmailForPasswordReset(req, res));
expertRouter.patch("/updatePassword", (req, res) => expertController.updatePassword(req, res));
expertRouter.post("/auth/refresh-token", (req, res) => expertController.refreshToken(req, res));
expertRouter.post("/slotCreation", expertAuth_1.expertAuth, (req, res) => slotController.createSlot(req, res));
expertRouter.post("/add_all_slots", (req, res) => slotController.addAllSlots(req, res));
expertRouter.get("/expertSlotDetails", expertAuth_1.expertAuth, (req, res) => slotController.expertSlotDetails(req, res));
expertRouter.delete("/removeSlot", expertAuth_1.expertAuth, (req, res) => slotController.removeSlot(req, res));
expertRouter.get("/get_booking_details", expertAuth_1.expertAuth, (req, res) => expertController.getBookingDetails(req, res));
expertRouter.get("/get_expert_dashboard_details", expertAuth_1.expertAuth, (req, res) => expertController.getExpertDashboardDetails(req, res));
expertRouter.get("/upcoming_appointment", expertAuth_1.expertAuth, (req, res) => bookedSlotController.upcomingAppointmentByExpert(req, res));
expertRouter.get("/updateUpcomingSlot", expertAuth_1.expertAuth, (req, res) => bookedSlotController.updateUpcomingSlot(req, res));
expertRouter.get("/update_consultationStatus", expertAuth_1.expertAuth, (req, res) => bookedSlotController.updateSlotStatus(req, res));
expertRouter.get("/get_bookings_of_expert", expertAuth_1.expertAuth, (req, res) => expertController.getExpertBookings(req, res));
expertRouter
    .use(expertAuth_1.expertAuth)
    .get("/expert_accessed_chats", (req, res) => chatController.getExpertChats(req, res))
    .get("/expertFetchAllMessages", (req, res) => chatController.getExpertMessages(req, res))
    .post("/expertSendMessage", (req, res) => chatController.expertSendMessage(req, res));
expertRouter
    .use(expertAuth_1.expertAuth)
    .get("/add_prescription", (req, res) => prescriptionController.addPrescription(req, res)).get("/prescriptions", (req, res) => prescriptionController.getAllPrescriptions(req, res)).get("/get_prescription_details", (req, res) => prescriptionController.getPrescriptionDetailsByExpert(req, res));
expertRouter
    .use(expertAuth_1.expertAuth)
    .get("/notifications", (req, res) => notificationController.getNotificationsForExpert(req, res)).put("/notifications/mark-as-read", (req, res) => notificationController.markNotificationAsReadForExpert(req, res)).put("/notifications/clear", (req, res) => notificationController.clearNotificationsForExpert(req, res));
expertRouter.get("/share_roomId_through_email", (req, res) => expertController.shareRoomIdThroughEmail(req, res));
exports.default = expertRouter;
