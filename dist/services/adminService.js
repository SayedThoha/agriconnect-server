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
// /* eslint-disable  @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminServices {
    constructor(adminRepository, jwtSecret = process.env.JWT_SECRET || "default_secret", baseDestinationPath = path_1.default.join("D:", "Project 2 Pics", "agriconnect_files")) {
        this.adminRepository = adminRepository;
        this.jwtSecret = jwtSecret;
        this.baseDestinationPath = baseDestinationPath;
        this.verificationOrder = [
            "id_proof_type",
            "id_proof",
            "expert_licence",
            "qualification_certificate",
            "exp_certificate",
            "specialisation",
            "current_working_address",
        ];
    }
    validateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.adminRepository.findByEmail(email);
            if (!adminData) {
                return {
                    success: false,
                    status: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                    message: "Invalid username",
                };
            }
            const passwordMatch = yield (0, hashPassword_1.comparePass)(password, adminData.password);
            if (!passwordMatch) {
                return {
                    success: false,
                    status: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                    message: "Incorrect Password",
                };
            }
            const accessToken = jsonwebtoken_1.default.sign({ adminId: adminData._id }, this.jwtSecret);
            const accessedUser = {
                email: adminData.email,
                role: adminData.role,
                payOut: adminData.payOut,
            };
            return {
                success: true,
                status: httpStatusCodes_1.Http_Status_Codes.OK,
                data: {
                    accessToken,
                    accessedUser,
                    message: "Login successfully",
                },
            };
        });
    }
    getAdminDashboardDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCount = yield this.adminRepository.getUserCount();
            const expertCount = yield this.adminRepository.getExpertCount();
            return {
                userCount,
                expertCount,
            };
        });
    }
    getAllExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experts = yield this.adminRepository.findAllExperts();
                return experts;
            }
            catch (error) {
                console.error("Error in getAllExperts service:", error);
                throw error;
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminRepository.findAllUsers();
                return users;
            }
            catch (error) {
                console.error("Error in getAllExperts service:", error);
                throw error;
            }
        });
    }
    toggleUserBlockStatus(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_id) {
                    throw new Error("User ID is required");
                }
                const user = yield this.adminRepository.findUserById(_id);
                if (!user) {
                    throw new Error("User not found");
                }
                const newBlockStatus = user.blocked === true ? false : true;
                yield this.adminRepository.updateUserBlockStatus(_id, newBlockStatus);
            }
            catch (error) {
                console.error("Error in toggleUserBlockStatus service:", error);
                throw error;
            }
        });
    }
    getUserDetails(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_id) {
                    throw new Error("User ID is required");
                }
                const user = yield this.adminRepository.findUserById(_id);
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            }
            catch (error) {
                console.error("Error in getUserDetails service:", error);
                throw error;
            }
        });
    }
    searchUsers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!searchTerm) {
                    throw new Error("Search term is required");
                }
                return yield this.adminRepository.searchUsers(searchTerm);
            }
            catch (error) {
                console.error("Error in searchUsers service:", error);
                throw error;
            }
        });
    }
    getAllSpecialisations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialisations = yield this.adminRepository.findAllSpecialisations();
                return specialisations;
            }
            catch (error) {
                console.error("Error in getAllSpecializations service:", error);
                throw error;
            }
        });
    }
    addSpecialisation(specialisationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!specialisationData.specialisation) {
                    throw new Error("Specialisation is required");
                }
                yield this.adminRepository.createSpecialisation(specialisationData.specialisation);
            }
            catch (error) {
                console.error("Error in addSpecialisation service:", error);
                throw error;
            }
        });
    }
    editSpecialisation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data._id || !data.specialisation) {
                    throw new Error("Invalid specialization data");
                }
                yield this.adminRepository.updateSpecialisation(data._id, data.specialisation);
            }
            catch (error) {
                console.error("Error in editSpecialisation service:", error);
                throw error;
            }
        });
    }
    deleteSpecialisation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_id) {
                    throw new Error("Specialisation ID is required");
                }
                const isDeleted = yield this.adminRepository.deleteSpecialisation(_id);
                if (!isDeleted) {
                    throw new Error("Specialisation not found");
                }
            }
            catch (error) {
                console.error("Error in deleteSpecialisation service:", error);
                throw error;
            }
        });
    }
    toggleExpertStatus(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_id) {
                    throw new Error("Expert ID is required");
                }
                const expert = yield this.adminRepository.findExpertById(_id);
                if (!expert) {
                    throw new Error("Expert not found");
                }
                // Toggle the status
                expert.blocked = expert.blocked === true ? false : true;
                yield this.adminRepository.updateExpertStatus(expert);
            }
            catch (error) {
                console.error("Error in toggleExpertStatus service:", error);
                throw error;
            }
        });
    }
    getPendingKycData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kycData = yield this.adminRepository.findPendingKycData();
                // Filter out entries where expertId is null
                const filteredKycData = kycData.filter((item) => item.expertId !== null);
                return filteredKycData;
            }
            catch (error) {
                console.error("Error in getPendingKycData service:", error);
                throw error;
            }
        });
    }
    getExpertKycDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!expertId) {
                    throw new Error("Expert ID is required");
                }
                const kycDetails = yield this.adminRepository.findKycByExpertId(expertId);
                if (!kycDetails) {
                    throw new Error("KYC details not found");
                }
                return kycDetails;
            }
            catch (error) {
                console.error("Error in getExpertKycDetails service:", error);
                throw error;
            }
        });
    }
    getFailedVerification(kycDetails) {
        for (const field of this.verificationOrder) {
            if (!kycDetails[field]) {
                const messages = {
                    id_proof_type: "Verify ID proof type selected and submitted are the same",
                    id_proof: "Verify ID proof",
                    expert_licence: "Verify experts's license",
                    qualification_certificate: "Verify qualification certificates",
                    exp_certificate: "Verify experience certificate",
                    specialisation: "Verify specialisation meets qualification",
                    current_working_address: "Verify currently working address",
                };
                return { field, message: messages[field] };
            }
        }
        return null;
    }
    submitKycDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data._id) {
                    throw new Error("KYC ID is required");
                }
                const kycDetails = yield this.adminRepository.updateKycDetails(data._id, data);
                if (!kycDetails) {
                    throw new Error("KYC details not found");
                }
                const failedVerification = this.getFailedVerification(kycDetails);
                if (failedVerification) {
                    return { message: failedVerification.message };
                }
                // All verifications passed, update expert status
                yield this.adminRepository.updateExpertKycStatus(data.expert_id, true);
                return { message: "KYC verification done" };
            }
            catch (error) {
                console.error("Error in submitKycDetails service:", error);
                throw error;
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFilePath(expert, name, index) {
        switch (name) {
            case "identity_proof":
                return expert.identity_proof;
            case "expert_licence":
                return expert.expert_licence;
            case "qualification_certificate":
                return index != -1 ? expert.qualification_certificate[index] : null;
            case "experience_certificate":
                return index != -1 ? expert.experience_certificate[index] : null;
            default:
                return null;
        }
    }
    /**
     * Copy file to destination folder.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copyFile(sourcePath, name) {
        const fullPath = path_1.default.resolve(sourcePath);
        const destinationPath = path_1.default.join(this.baseDestinationPath, `${name}_${Date.now()}${path_1.default.basename(fullPath)}`);
        return new Promise((resolve, reject) => {
            fs_1.default.copyFile(fullPath, destinationPath, (err) => {
                if (err) {
                    console.error("Error copying file:", err);
                    reject(new Error("File copy failed"));
                }
                else {
                    resolve(destinationPath);
                }
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    downloadDocument(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { expertId, name, index } = data;
            const expert = yield this.adminRepository.findExpertById(expertId);
            if (!expert) {
                throw new Error("Expert not found");
            }
            const filePath = this.getFilePath(expert, name, index);
            if (!filePath) {
                throw new Error("File not found");
            }
            return this.copyFile(filePath, name);
        });
    }
}
exports.default = AdminServices;
