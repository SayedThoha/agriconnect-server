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
const adminModel_1 = require("../../models/adminModel");
const expertKycModel_1 = require("../../models/expertKycModel");
const expertModel_1 = require("../../models/expertModel");
const specialisationModel_1 = require("../../models/specialisationModel");
const userModel_1 = require("../../models/userModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class AdminRepository extends baseRepository_1.default {
    constructor() {
        super(adminModel_1.Admin);
    }
    // async findByEmail(email: string): Promise<IAdmin | null> {
    //   return await Admin.findOne({ email });
    // }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ email });
            }
            catch (error) {
                throw new Error(`Error finding admin by email: ${error}`);
            }
        });
    }
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.countDocuments({});
            }
            catch (error) {
                throw new Error(`Error getting user count: ${error}`);
            }
        });
    }
    getExpertCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.countDocuments({});
            }
            catch (error) {
                throw new Error(`Error getting expert count: ${error}`);
            }
        });
    }
    findAllExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experts = yield expertModel_1.Expert.find();
                return experts;
            }
            catch (error) {
                console.error("Error in findAllExperts repository:", error);
                throw error;
            }
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.find();
                return users;
            }
            catch (error) {
                console.error("Error in findAllExperts repository:", error);
                throw error;
            }
        });
    }
    findAllSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialisations = yield specialisationModel_1.Specialisation.find();
                return specialisations;
            }
            catch (error) {
                console.error("Error in findAllSpecializations repository:", error);
                throw error;
            }
        });
    }
    createSpecialisation(specialisation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSpecialisation = yield specialisationModel_1.Specialisation.create({
                    specialisation: specialisation,
                });
                yield newSpecialisation.save();
                return newSpecialisation;
            }
            catch (error) {
                console.error("Error in createSpecialization repository:", error);
                throw error;
            }
        });
    }
    updateSpecialisation(_id, specialisation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield specialisationModel_1.Specialisation.updateOne({ _id }, { specialisation });
                if (!result.matchedCount) {
                    throw new Error("Specialisation not found");
                }
            }
            catch (error) {
                console.error("Error in updateSpecialisation repository:", error);
                throw error;
            }
        });
    }
    deleteSpecialisation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield specialisationModel_1.Specialisation.deleteOne({ _id });
                return result.deletedCount > 0;
            }
            catch (error) {
                console.error("Error in deleteSpecialisation repository:", error);
                throw error;
            }
        });
    }
    findUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.findOne({ _id });
            }
            catch (error) {
                console.error("Error in findUserById repository:", error);
                throw error;
            }
        });
    }
    updateUserBlockStatus(_id, blocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.User.findOne({ _id });
                if (!user) {
                    throw new Error("User not found");
                }
                user.blocked = blocked;
                yield user.save();
            }
            catch (error) {
                console.error("Error in updateUserBlockStatus repository:", error);
                throw error;
            }
        });
    }
    searchUsers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp("^" + searchTerm.toLowerCase(), "i");
                const users = yield userModel_1.User.find();
                return users.filter((user) => regex.test(user.firstName) ||
                    regex.test(user.lastName) ||
                    regex.test(user.email));
            }
            catch (error) {
                console.error("Error in searchUsers repository:", error);
                throw error;
            }
        });
    }
    searchExperts(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp("^" + searchTerm.toLowerCase(), "i");
                const experts = yield expertModel_1.Expert.find();
                return experts.filter((expert) => regex.test(expert.firstName) ||
                    regex.test(expert.lastName) ||
                    regex.test(expert.email));
            }
            catch (error) {
                console.error("Error in searchExperts repository:", error);
                throw error;
            }
        });
    }
    findExpertById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findById(_id);
            }
            catch (error) {
                console.error("Error in findById repository:", error);
                throw error;
            }
        });
    }
    updateExpertStatus(expert) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield expert.save();
            }
            catch (error) {
                console.error("Error in updateExpertStatus repository:", error);
                throw error;
            }
        });
    }
    findPendingKycData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield expertKycModel_1.ExpertKyc.find()
                    .populate({
                    path: "expertId",
                    match: { kyc_verification: "false" },
                    select: "-password -created_time -otp -otp_update_time -__v",
                })
                    .exec();
                return data;
            }
            catch (error) {
                console.error("Error in findPendingKycData repository:", error);
                throw error;
            }
        });
    }
    findKycByExpertId(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertKycModel_1.ExpertKyc.findOne({ expertId }).populate("expertId").exec();
            }
            catch (error) {
                console.error("Error in findKycByExpertId repository:", error);
                throw error;
            }
        });
    }
    updateKycDetails(kycId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertKycModel_1.ExpertKyc.findByIdAndUpdate(kycId, {
                    $set: {
                        exp_certificate: updateData.exp_certificate,
                        qualification_certificate: updateData.qualification_certificate,
                        expert_licence: updateData.expert_licence,
                        id_proof_type: updateData.id_proof_type,
                        id_proof: updateData.id_proof,
                        specialisation: updateData.specialisation,
                        current_working_address: updateData.current_working_address,
                    },
                }, { new: true });
            }
            catch (error) {
                console.error("Error in updateKycDetails repository:", error);
                throw error;
            }
        });
    }
    updateExpertKycStatus(expertId, verified) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield expertModel_1.Expert.findByIdAndUpdate(expertId, {
                    $set: { kyc_verification: verified },
                });
            }
            catch (error) {
                console.error('Error in updateExpertKycStatus repository:', error);
                throw error;
            }
        });
    }
    findByIdForDownload(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findById(expertId);
            }
            catch (error) {
                console.error('Error in findById repository:', error);
                throw error;
            }
        });
    }
}
exports.default = AdminRepository;
