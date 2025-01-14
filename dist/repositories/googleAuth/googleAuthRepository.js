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
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class GoogleAuthRepository {
    constructor(clientId, userRepository) {
        this.client = new google_auth_library_1.OAuth2Client(clientId);
        this.userRepository = userRepository;
    }
    verifyGoogleToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this.client.verifyIdToken({
                idToken: token,
                audience: this.client._clientId,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error("Invalid Google token");
            }
            return {
                email: payload.email,
                name: payload.name,
                googleId: payload.sub,
                photoUrl: payload.picture,
            };
        });
    }
    handleGoogleLogin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const payload = yield this.verifyGoogleToken(token);
                let user = yield this.userRepository.findUserByEmail(payload.email);
                if (!user) {
                    // If user does not exist, create a new user
                    user = yield this.userRepository.saveUser({
                        email: payload.email,
                        firstName: (_a = payload.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0],
                        lastName: ((_b = payload.name) === null || _b === void 0 ? void 0 : _b.split(" ")[1]) || "",
                        googleId: payload.googleId,
                        profile_picture: payload.photoUrl,
                        is_verified: true,
                        authProvider: "google", // Mark as verified since Google handles verification
                    });
                }
                if (!user._id) {
                    throw new Error("User ID is missing after saving.");
                }
                const jwtToken = this.generateJwt(user);
                return {
                    success: true,
                    token: jwtToken,
                    user: payload,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Login successful",
                };
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    token: "",
                    user: {},
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: `Login failed `,
                };
            }
        });
    }
    generateJwt(user) {
        return jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.firstName + " " + user.lastName,
        }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
    }
}
exports.default = GoogleAuthRepository;
