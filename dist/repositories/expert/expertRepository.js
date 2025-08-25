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
const bookeSlotModel_1 = require("../../models/bookeSlotModel");
const prescriptionModel_1 = require("../../models/prescriptionModel");
const userModel_1 = require("../../models/userModel");
const slotModel_1 = require("../../models/slotModel");
class ExpertRepository extends baseRepository_1.default {
    constructor() {
        super(expertModel_1.Expert);
    }
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield specialisationModel_1.Specialisation.find();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findOne({ email });
            }
            catch (error) {
                console.error(error);
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
    findExpertById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expert = yield this.findById(id);
                return expert;
            }
            catch (error) {
                console.error("Error in expert repository findById:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    updateExpertProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(id, updateData);
        });
    }
    updateExpertById(expertId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(expertId, updateData);
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
    getBookingDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
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
    findBookedSlotsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            const slots = yield slotModel_1.Slot.find({
                expertId: expertId,
                booked: true,
                time: { $gte: now },
            }).sort({ time: 1 });
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
}
exports.default = ExpertRepository;
