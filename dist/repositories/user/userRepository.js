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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../../models/userModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class UserRepository extends baseRepository_1.default {
    constructor() {
        super(userModel_1.User);
    }
    // async emailExist(email: string): Promise<IUser | null> {
    //   // Check if the email exists in the database
    //   console.log("checK email exist in user repository");
    //   return await User.findOne({ email });
    // }
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
    // async saveUser(userData: Partial<IUser>): Promise<IUser> {
    //   const user = new User(userData);
    //   return await user.save();
    // }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(userData); // Using base repository create method
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by ID
            return yield userModel_1.User.findById(id);
        });
    }
    // async checkEmail(email: string): Promise<IUser | null> {
    //   // Another email check method
    //   return await User.findOne({ email });
    // }
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
    // async updateUserOtp(email: string, otp: string): Promise<IUser | null> {
    //   return await User.findOneAndUpdate(
    //     { email },
    //     {
    //       $set: { otp },
    //       $currentDate: { otp_update_time: true },
    //     },
    //     { new: true }
    //   );
    // }
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
    // async findUserByEmail(email: string): Promise<IUser | null> {
    //   return await User.findOne({ email });
    // }
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
    // async updateUserVerification(
    //   email: string,
    //   isVerified: boolean,
    //   newEmail?: string
    // ): Promise<IUser | null> {
    //   const updateData: Partial<IUser> = {
    //     is_verified: isVerified,
    //   };
    //   if (newEmail) {
    //     updateData.email = newEmail;
    //   }
    //   return await User.findOneAndUpdate(
    //     { email },
    //     { $set: updateData },
    //     { new: true }
    //   );
    // }
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
    // async updateUserOtpDetails(
    //   userId: string,
    //   otp: string
    // ): Promise<IUser | null> {
    //   return await User.findByIdAndUpdate(
    //     userId,
    //     {
    //       $set: {
    //         otp,
    //         otp_update_time: new Date(),
    //       },
    //     },
    //     { new: true }
    //   );
    // }
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
                // return await User.findById(id);
                return this.findById(id); // Using base repository findById method
            }
            catch (error) {
                console.error("Error in expert repository findById:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    // async updateUserProfile(
    //   id: string,
    //   updateData: Partial<IUser>
    // ): Promise<IUser | null> {
    //   try {
    //     return await User.findByIdAndUpdate(
    //       id,
    //       { $set: updateData },
    //       { new: true }
    //     );
    //   } catch (error) {
    //     console.error("Error in user repository updateUserProfile:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateUserProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.update(id, updateData); // Using base repository update method
            }
            catch (error) {
                console.error("Error in user repository updateUserProfile:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    // async updateUserById(
    //   userId: string,
    //   updateData: Partial<IUser>
    // ): Promise<IUser | null> {
    //   try {
    //     return await User.findByIdAndUpdate(
    //       userId,
    //       { $set: updateData },
    //       { new: true }
    //     );
    //   } catch (error) {
    //     console.error("Error in updateUserById:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateUserById(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(userId, updateData); // Using base repository update method
        });
    }
    // async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
    //   try {
    //     await User.findByIdAndUpdate(userId, {
    //       $set: { profile_picture: imageUrl },
    //     });
    //   } catch (error) {
    //     console.error("Error in updateProfilePicture repository:", error);
    //     throw new Error("Database operation failed");
    //   }
    // }
    updateProfilePicture(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.update(userId, { profile_picture: imageUrl });
            }
            catch (error) {
                throw new Error(`Error updating profile picture: ${error}`);
            }
        });
    }
    // async checkUserStatus(userId: string): Promise<{ blocked: boolean }> {
    //   try {
    //     const user = await User.findById(userId).select("blocked");
    //     if (!user) {
    //       throw new Error("User not found");
    //     }
    //     return { blocked: user.blocked ?? false };
    //   } catch (error) {
    //     console.error("error for user check status repository", error);
    //     throw new Error("Data base operation failed");
    //   }
    // }
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
}
exports.default = UserRepository;
