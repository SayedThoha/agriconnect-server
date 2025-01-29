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
class GoogleAuthController {
    constructor(googleAuthService) {
        this.googleAuthService = googleAuthService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("enteerin google login");
            const { token } = req.body;
            if (!token) {
                res.status(400).json({
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                    message: "Google token is required",
                    token: "",
                    user: {},
                });
                return;
            }
            try {
                const response = yield this.googleAuthService.loginWithGoogle(token);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: `Server error }`,
                    token: "",
                    user: {},
                });
            }
        });
    }
}
exports.default = GoogleAuthController;
