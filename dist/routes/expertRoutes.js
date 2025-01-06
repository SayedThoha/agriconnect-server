"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expertRepository_1 = __importDefault(require("../repositories/expert/expertRepository"));
const expertService_1 = __importDefault(require("../services/expertService"));
const expertController_1 = __importDefault(require("../controllers/expertController"));
const multer_1 = __importDefault(require("../utils/multer"));
const expertRouter = express_1.default.Router();
const expertRepository = new expertRepository_1.default();
const expertService = new expertService_1.default(expertRepository);
const expertController = new expertController_1.default(expertService);
expertRouter.post("/registration", multer_1.default.fields([
    { name: "identity_proof", maxCount: 1 },
    { name: "expert_licence", maxCount: 1 },
    { name: "profile_picture", maxCount: 1 },
    { name: "qualification_certificate" },
    { name: "experience_certificate" },
]), (req, res, next) => {
    console.log("Incoming request:", req.body);
    console.log("Incoming files:", req.files);
    next();
}, (req, res) => expertController.expertRegistration(req, res));
expertRouter.get("/specialisation", (req, res) => expertController.getSpecialisation(req, res));
expertRouter.post("/resend-otp", (req, res) => expertController.resendOtp(req, res));
expertRouter.post("/verifyOtp", (req, res) => expertController.verifyOtp(req, res));
expertRouter.post("/login", (req, res) => expertController.login(req, res));
exports.default = expertRouter;
