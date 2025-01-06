"use strict";
//userRepository.ts
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
const userModel_1 = require("../../models/userModel");
class UserRepository {
    constructor() { }
    emailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the email exists in the database
            console.log("checK email exist in user repository");
            return yield userModel_1.User.findOne({ email });
        });
    }
    saveUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Save user data to the database
            // return await User.create(data);
            console.log('save user in user repository');
            const user = new userModel_1.User(data);
            return yield user.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by ID
            return yield userModel_1.User.findById(id);
        });
    }
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Another email check method
            return yield userModel_1.User.findOne({ email });
        });
    }
    updateUserOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.User.findOneAndUpdate({ email }, {
                $set: { otp },
                $currentDate: { otp_update_time: true },
            }, { new: true });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.User.findOne({ email });
        });
    }
    updateUserVerification(email, isVerified, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                is_verified: isVerified
            };
            if (newEmail) {
                updateData.email = newEmail;
            }
            return yield userModel_1.User.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
        });
    }
    // async findUserByEmail(email: string): Promise<IUser | null> {
    //     return await User.findOne({ email });
    // }
    updateUserOtpDetails(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.User.findByIdAndUpdate(userId, {
                $set: {
                    otp,
                    otp_update_time: new Date()
                }
            }, { new: true });
        });
    }
}
exports.default = UserRepository;
