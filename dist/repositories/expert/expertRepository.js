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
class ExpertRepository extends baseRepository_1.default {
    constructor() {
        super(expertModel_1.Expert);
    }
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get specialisation serverside");
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
    // async create(expertData: Partial<IExpert>): Promise<IExpert> {
    //   const expert = await Expert.create(expertData);
    //   return await expert.save();
    // }
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
    // async updateExpertProfile(
    //   id: string,
    //   updateData: Partial<IExpert>
    // ): Promise<IExpert | null> {
    //   try {
    //     return await Expert.findOneAndUpdate(
    //       { _id: id },
    //       {
    //         $set: updateData,
    //       },
    //       { new: true }
    //     );
    //   } catch (error) {
    //     console.error("Error in expert repository updateExpertProfile:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateExpertProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(id, updateData); // Using base repository method
        });
    }
    // async updateExpertById(
    //   expertId: string,
    //   updateData: Partial<IExpert>
    // ): Promise<IExpert | null> {
    //   try {
    //     return await Expert.findByIdAndUpdate(
    //       expertId,
    //       { $set: updateData },
    //       { new: true }
    //     );
    //   } catch (error) {
    //     console.error("Error in updateExpertById:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateExpertById(expertId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(expertId, updateData); // Using base repository method
        });
    }
    // async updateProfilePicture(
    //   expertId: string,
    //   imageUrl: string
    // ): Promise<void> {
    //   try {
    //     await Expert.findByIdAndUpdate(expertId, {
    //       $set: { profile_picture: imageUrl },
    //     });
    //   } catch (error) {
    //     console.error("Error in updateProfilePicture repository:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateProfilePicture(expertId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.update(expertId, { profile_picture: imageUrl });
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
                // const expert = await Expert.findById(expertId).select("blocked");
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
                return yield Slot.findOne({ expertId, time });
            }
            catch (error) {
                throw new Error(`Error finding slot: ${error}`);
            }
        });
    }
}
exports.default = ExpertRepository;
