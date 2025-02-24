"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const specialisationModel_1 = require("../../models/specialisationModel");
const expertModel_1 = require("../../models/expertModel");
const expertKycModel_1 = require("../../models/expertKycModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
const slotModel_1 = require("../../models/slotModel");
const adminModel_1 = require("../../models/adminModel");
const bookeSlotModel_1 = require("../../models/bookeSlotModel");
const prescriptionModel_1 = require("../../models/prescriptionModel");
const userModel_1 = require("../../models/userModel");
const notificationModel_1 = require("../../models/notificationModel");
class ExpertRepository extends baseRepository_1.default {
    constructor() {
        super(expertModel_1.Expert);
    }
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("get specialisation serverside");
            return yield specialisationModel_1.Specialisation.find();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findOne({ email });
            }
            catch (error) {
                console.log(error);
                throw new Error(`Error finding expert by email: ${error}`);
            }
        });
    }
    createKyc(expertId, expertDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertKycModel_1.ExpertKyc.create({
                    expertId: expertId,
                    address: expertDetails.current_working_address,
                    identity_proof_name: expertDetails.identity_proof_type,
                    specialisation_name: expertDetails.specialisation,
                });
            }
            catch (error) {
                throw new Error(`Error creating expert KYC: ${error}`);
            }
        });
    }
    updateExpertOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findOneAndUpdate({ email }, {
                    $set: { otp },
                    $currentDate: { otp_update_time: true },
                }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating expert OTP: ${error}`);
            }
        });
    }
    updateExpertVerification(email, isVerified, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    is_verified: isVerified,
                };
                if (newEmail) {
                    updateData.email = newEmail;
                }
                return yield expertModel_1.Expert.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating expert verification: ${error}`);
            }
        });
    }
    updateExpertOtpDetails(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findByIdAndUpdate(userId, {
                    $set: {
                        otp,
                        otp_update_time: new Date(),
                    },
                }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating expert OTP details: ${error}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findById(id);
            }
            catch (error) {
                console.error("Error in expert repository findById:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    updateExpertProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(id, updateData); // Using base repository method
        });
    }
    updateExpertById(expertId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(expertId, updateData); // Using base repository method
        });
    }
    updateProfilePicture(expertId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.update(expertId, {
                    profile_picture: imageUrl,
                });
            }
            catch (error) {
                throw new Error(`Error updating profile picture: ${error}`);
            }
        });
    }
    checkExpertStatus(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const expert = yield this.findById(expertId);
                if (!expert) {
                    throw new Error("Expert not found");
                }
                return { blocked: (_a = expert.blocked) !== null && _a !== void 0 ? _a : false };
            }
            catch (error) {
                console.error("error for expert check status repository", error);
                throw new Error("Data base operation failed");
            }
        });
    }
    updatePassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating password: ${error}`);
            }
        });
    }
    findSlotByExpertIdAndTime(expertId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield slotModel_1.Slot.findOne({ expertId, time });
            }
            catch (error) {
                throw new Error(`Error finding slot: ${error}`);
            }
        });
    }
    createSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield slotModel_1.Slot.create(slotData);
                return yield slot.save();
            }
            catch (error) {
                throw new Error(`Error creating slot: ${error}`);
            }
        });
    }
    findAdminSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield adminModel_1.Admin.find({});
            }
            catch (error) {
                throw new Error(`Error finding admin settings: ${error}`);
            }
        });
    }
    createMultipleSlots(slots) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.insertMany(slots);
        });
    }
    findSlotsByExpertId(expertId, currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield slotModel_1.Slot.find({
                    expertId: expertId,
                    time: { $gte: currentTime },
                }).sort({ time: 1 });
            }
            catch (error) {
                throw new Error(`Error fetching slots for expert ${expertId}: ${error}`);
            }
        });
    }
    findSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.findById(slotId);
        });
    }
    deleteSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.findByIdAndDelete(slotId);
        });
    }
    getBookingDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const now = new Date().toISOString();
            // time: { $gte: now }
            return yield bookeSlotModel_1.BookedSlot.find({
                expertId: expertId,
            })
                .populate("slotId")
                .populate("userId")
                .populate("expertId");
        });
    }
    getExpertDashboardDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookedSlots = yield bookeSlotModel_1.BookedSlot.find({
                    expertId: expertId,
                }).populate("slotId");
                return bookedSlots;
            }
            catch (error) {
                console.error("Error in findBookedSlotsByUser:", error);
                throw error;
            }
        });
    }
    findPendingAppointmentsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.find({ expertId, consultation_status: "pending" })
                .populate({
                path: "slotId",
                model: "Slot",
            })
                .populate("userId")
                .populate("expertId");
        });
    }
    findSlotByIdAndUpdate(slotId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate({ _id: slotId }, { $set: { roomId: roomId } });
        });
    }
    findSlotByIdAndUpdateStatus(slotId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate({ _id: slotId }, {
                $set: { consultation_status: status },
            });
        });
    }
    findBookedSlotsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            const slots = yield slotModel_1.Slot.find({
                expertId: expertId,
                booked: true,
                time: { $gte: now },
            }).sort({ time: 1 });
            // Convert ObjectIds to strings
            return slots.map((slot) => slot._id.toString());
        });
    }
    findBookedSlotsBySlotIds(slotIds, expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.find({
                slotId: { $in: slotIds },
                expertId: expertId,
                consultation_status: "pending",
            })
                .populate("slotId")
                .populate("userId")
                .populate("expertId");
        });
    }
    createPrescription(prescriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPrescription = new prescriptionModel_1.Prescription(prescriptionData);
            return yield newPrescription.save();
        });
    }
    updateBookedSlotWithPrescription(appointmentId, prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate(appointmentId, {
                $set: { prescription_id: prescriptionId },
            });
        });
    }
    findBookedSlotById(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findById(appointmentId);
        });
    }
    updateRoomIdForSlot(slotId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate(slotId, { $set: { roomId } }, { new: true });
        });
    }
    getUserEmailFromSlot(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findById(slot === null || slot === void 0 ? void 0 : slot.userId);
            return user ? user.email : null;
        });
    }
    findPrescriptionById(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prescriptionModel_1.Prescription.findById(prescriptionId);
        });
    }
    getPrescriptionsByExpert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prescriptions = yield prescriptionModel_1.Prescription.find()
                    .populate({
                    path: "bookedSlot",
                    populate: {
                        path: "userId",
                        select: "firstName lastName email",
                    },
                })
                    .populate({
                    path: "bookedSlot",
                    populate: {
                        path: "expertId",
                        select: "firstName lastName",
                    },
                });
                console.log("prescriptions", prescriptions);
                return prescriptions;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error fetching prescriptions");
            }
        });
    }
    getNotifications(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("get notification repository");
                const notifications = yield notificationModel_1.Notification.find({
                    expertId,
                    isClearedByExpert: false,
                }).sort({
                    createdAt: -1,
                }).populate({
                    path: "userId",
                    select: "firstName lastName",
                });
                ;
                return notifications;
            }
            catch (error) {
                console.error("Error in notification repository:", error);
                throw error;
            }
        });
    }
    markNotificationAsRead(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // await Notification.updateMany({expertId,isRead:false},{ $set: { isRead: true } })
                yield notificationModel_1.Notification.updateMany({ expertId, isReadByExpert: false }, { $set: { isReadByExpert: true } });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    clearNotifications(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // await Notification.deleteMany({ expertId });
                yield notificationModel_1.Notification.updateMany({ expertId, isClearedByExpert: false }, { $set: { isClearedByExpert: true } });
            }
            catch (error) {
                console.error("Error in clearing notifications (Repository):", error);
                throw error;
            }
        });
    }
}
exports.default = ExpertRepository;
