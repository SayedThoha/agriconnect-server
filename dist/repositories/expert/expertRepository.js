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
Object.defineProperty(exports, "__esModule", { value: true });
const specialisationModel_1 = require("../../models/specialisationModel");
const expertModel_1 = require("../../models/expertModel");
const expertKycModel_1 = require("../../models/expertKycModel");
class ExpertRepository {
    constructor() { }
    getSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get specialisation serverside");
            return yield specialisationModel_1.specialisation.find();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertModel_1.Expert.findOne({ email });
        });
    }
    create(expertData) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield expertModel_1.Expert.create(expertData);
            return yield expert.save();
        });
    }
    createKyc(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertKycModel_1.ExpertKyc.create({
                expertId: expertId,
            });
        });
    }
    updateExpertOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertModel_1.Expert.findOneAndUpdate({ email }, {
                $set: { otp },
                $currentDate: { otp_update_time: true },
            }, { new: true });
        });
    }
    updateExpertVerification(email, isVerified, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                is_verified: isVerified
            };
            if (newEmail) {
                updateData.email = newEmail;
            }
            return yield expertModel_1.Expert.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
        });
    }
    updateExpertOtpDetails(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertModel_1.Expert.findByIdAndUpdate(userId, {
                $set: {
                    otp,
                    otp_update_time: new Date()
                }
            }, { new: true });
        });
    }
}
exports.default = ExpertRepository;
