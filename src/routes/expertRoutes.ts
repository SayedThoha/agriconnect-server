import express from "express";
import ExpertRepository from "../repositories/expert/expertRepository";
import ExpertService from "../services/expert/expertService";
import ExpertController from "../controllers/expert/expertController";
import upload from "../utils/multer";
import { expertAuth } from "../middlewares/expertAuth";
import ChatRepository from "../repositories/chat/chatRepository";
import ChatService from "../services/chat/chatService";
import ChatController from "../controllers/chat/chatController";
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

const expertRouter = express.Router();

const expertRepository = new ExpertRepository();
const expertService = new ExpertService(expertRepository);
const expertController = new ExpertController(expertService);

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

expertRouter.post(
  "/registration",
  upload.fields([
    { name: "identity_proof", maxCount: 1 },
    { name: "expert_licence", maxCount: 1 },
    { name: "profile_picture", maxCount: 1 },
    { name: "qualification_certificate" },
    { name: "experience_certificate" },
  ]),
  (req, res) => expertController.expertRegistration(req, res)
);
expertRouter.get("/specialisation", (req, res) =>
  expertController.getSpecialisation(req, res)
);

expertRouter.post("/resendOtp", (req, res) =>
  expertController.resendOtp(req, res)
);

expertRouter.post("/verifyOtp", (req, res) =>
  expertController.verifyOtp(req, res)
);

expertRouter.post("/login", (req, res) => expertController.login(req, res));

expertRouter.get("/getExpertDetails", expertAuth, (req, res) =>
  expertController.getExpertDetails(req, res)
);

expertRouter.post("/editExpertProfile", expertAuth, (req, res) =>
  expertController.editExpertProfile(req, res)
);

expertRouter.post("/opt_for_new_email", expertAuth, (req, res) =>
  expertController.optForNewEmail(req, res)
);

expertRouter.post("/edit_expert_profile_picture", expertAuth, (req, res) =>
  expertController.editExpertProfilePicture(req, res)
);

expertRouter.get("/status/:id", expertAuth, (req, res) =>
  expertController.checkExpertStatus(req, res)
);

expertRouter.post("/verifyEmail", (req, res) =>
  expertController.verifyEmailForPasswordReset(req, res)
);

expertRouter.patch("/updatePassword", (req, res) =>
  expertController.updatePassword(req, res)
);

expertRouter.post("/auth/refresh-token", (req, res) =>
  expertController.refreshToken(req, res)
);

expertRouter.post("/slotCreation", expertAuth, (req, res) =>
  slotController.createSlot(req, res)
);

expertRouter.post("/add_all_slots", (req, res) =>
  slotController.addAllSlots(req, res)
);

expertRouter.get("/expertSlotDetails", expertAuth, (req, res) =>
  slotController.expertSlotDetails(req, res)
);

expertRouter.delete("/removeSlot", expertAuth, (req, res) =>
  slotController.removeSlot(req, res)
);

expertRouter.get("/get_booking_details", expertAuth, (req, res) =>
  expertController.getBookingDetails(req, res)
);
expertRouter.get("/get_expert_dashboard_details", expertAuth, (req, res) =>
  expertController.getExpertDashboardDetails(req, res)
);

expertRouter.get("/upcoming_appointment", expertAuth, (req, res) =>
  bookedSlotController.upcomingAppointmentByExpert(req, res)
);

expertRouter.get("/updateUpcomingSlot", expertAuth, (req, res) =>
  bookedSlotController.updateUpcomingSlot(req, res)
);

expertRouter.get("/update_consultationStatus", expertAuth, (req, res) =>
  bookedSlotController.updateSlotStatus(req, res)
);

expertRouter.get("/get_bookings_of_expert", expertAuth, (req, res) =>
  expertController.getExpertBookings(req, res)
);

expertRouter.get("/expert_accessed_chats", (req, res) =>
  chatController.getExpertChats(req, res)
);
expertRouter.get("/expertFetchAllMessages", (req, res) =>
  chatController.getExpertMessages(req, res)
);
expertRouter.post("/expertSendMessage", (req, res) =>
  chatController.expertSendMessage(req, res)
);

expertRouter.get("/add_prescription", (req, res) =>
  prescriptionController.addPrescription(req, res)
);

expertRouter.get("/prescriptions", (req, res) =>
  prescriptionController.getAllPrescriptions(req, res)
);

expertRouter.get("/share_roomId_through_email", (req, res) =>
  expertController.shareRoomIdThroughEmail(req, res)
);

expertRouter.get("/get_prescription_details", (req, res) =>
  prescriptionController.getPrescriptionDetailsByExpert(req, res)
);

expertRouter.get("/notifications", (req, res) =>
  notificationController.getNotificationsForExpert(req, res)
);

expertRouter.put("/notifications/mark-as-read", (req, res) =>
  notificationController.markNotificationAsReadForExpert(req, res)
);

expertRouter.put("/notifications/clear", (req, res) =>
  notificationController.clearNotificationsForExpert(req, res)
);

export default expertRouter;
