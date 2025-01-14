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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
class GoogleAuthService {
    constructor(googleAuthRepository) {
        this.googleAuthRepository = googleAuthRepository;
    }
    loginWithGoogle(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate to repository
                const response = yield this.googleAuthRepository.handleGoogleLogin(token);
                return response;
            }
            catch (error) {
                //   throw new Error(`Google login failed: ${error.message}`);
                console.log(error);
                return {
                    success: false,
                    token: "",
                    user: {},
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal server error",
                };
            }
        });
    }
}
exports.default = GoogleAuthService;
