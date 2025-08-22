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
const expertModel_1 = require("../../models/expertModel");
const specialisationModel_1 = require("../../models/specialisationModel");
const userModel_1 = require("../../models/userModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
const slotModel_1 = require("../../models/slotModel");
const bookeSlotModel_1 = require("../../models/bookeSlotModel");
class UserRepository extends baseRepository_1.default {
    constructor() {
        super(userModel_1.User);
    }
    emailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ email });
            }
            catch (error) {
                throw new Error(`Error checking email existence: ${error}`);
            }
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(userData);
        });
    }
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ email });
            }
            catch (error) {
                throw new Error(`Error checking email: ${error}`);
            }
        });
    }
    updateUserOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOneAndUpdate({ email }, {
                    $set: { otp },
                    $currentDate: { otp_update_time: true },
                }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating user OTP: ${error}`);
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ email });
            }
            catch (error) {
                throw new Error(`Error finding user by email: ${error}`);
            }
        });
    }
    updateUserVerification(email, isVerified, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    is_verified: isVerified,
                };
                if (newEmail) {
                    updateData.email = newEmail;
                }
                return yield this.model.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating user verification: ${error}`);
            }
        });
    }
    updateUserOtpDetails(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findByIdAndUpdate(userId, {
                    $set: {
                        otp,
                        otp_update_time: new Date(),
                    },
                }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating user OTP details: ${error}`);
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.findById(id);
            }
            catch (error) {
                console.error("Error in expert repository findById:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    updateUserProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.update(id, updateData);
            }
            catch (error) {
                console.error("Error in user repository updateUserProfile:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    updateUserById(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(userId, updateData);
        });
    }
    updateProfilePicture(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.update(userId, {
                    profile_picture: imageUrl,
                });
            }
            catch (error) {
                throw new Error(`Error updating profile picture: ${error}`);
            }
        });
    }
    checkUserStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield this.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                return { blocked: (_a = user.blocked) !== null && _a !== void 0 ? _a : false };
            }
            catch (error) {
                throw new Error(`Error checking user status: ${error}`);
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
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield specialisationModel_1.Specialisation.find();
        });
    }
    getExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experts = yield expertModel_1.Expert.find({
                    kyc_verification: true,
                    blocked: false,
                    is_verified: true,
                });
                return experts;
            }
            catch (error) {
                console.error("Error in findAllExperts repository:", error);
                throw error;
            }
        });
    }
    getExpertDetailsById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expert = yield expertModel_1.Expert.findById(expertId);
                return expert;
            }
            catch (error) {
                console.error("Error in findExpertDetails repository:", error);
                throw error;
            }
        });
    }
    findSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield slotModel_1.Slot.findById(slotId).populate("expertId").exec();
                return slot;
            }
            catch (error) {
                console.error("Error in slot repository findSlotById:", error);
                throw error;
            }
        });
    }
    findBookedSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield bookeSlotModel_1.BookedSlot.findOne({ slotId });
                return slot;
            }
            catch (error) {
                console.error("Error in bookedSlot repository findBookedSlot:", error);
                throw error;
            }
        });
    }
    updateSlotBookingStatus(slotId, booked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield slotModel_1.Slot.findByIdAndUpdate(slotId, { $set: { booked } }, { new: true });
            }
            catch (error) {
                console.error("Error in updateSlotBookingStatus:", error);
                throw error;
            }
        });
    }
    createBookedSlot(bookingDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookeSlotModel_1.BookedSlot.create(bookingDetails);
            }
            catch (error) {
                console.error("Error in createBookedSlot:", error);
                throw error;
            }
        });
    }
    findBookedSlotsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookedSlots = yield bookeSlotModel_1.BookedSlot.find({ userId })
                    .populate({
                    path: "slotId",
                    populate: {
                        path: "expertId",
                    },
                })
                    .populate("userId")
                    .exec();
                return bookedSlots;
            }
            catch (error) {
                console.error("Error in findBookedSlotsByUser:", error);
                throw error;
            }
        });
    }
    updateWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.User.findByIdAndUpdate(userId, { $inc: { wallet: amount } });
        });
    }
    findSlotByIdAndUpdate(slotId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.findByIdAndUpdate(slotId, { $set: updateData }, { new: true });
        });
    }
    findOneBookedSlotAndUpdate(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findOneAndUpdate(filter, { $set: updateData }, { new: true });
        });
    }
    findBookedSlotById(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findById(appointmentId);
        });
    }
    updateUserWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.User.findByIdAndUpdate(userId, { $inc: { wallet: amount } });
        });
    }
}
exports.default = UserRepository;
