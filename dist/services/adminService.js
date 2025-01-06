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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminServices {
    constructor(adminRepository, jwtSecret = process.env.JWT_SECRET || "default_secret") {
        this.adminRepository = adminRepository;
        this.jwtSecret = jwtSecret;
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
}
exports.default = AdminServices;
