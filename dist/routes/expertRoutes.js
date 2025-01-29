"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expertRepository_1 = __importDefault(require("../repositories/expert/expertRepository"));
const expertService_1 = __importDefault(require("../services/expert/expertService"));
const expertController_1 = __importDefault(require("../controllers/expert/expertController"));
const multer_1 = __importDefault(require("../utils/multer"));
const expertAuth_1 = require("../middlewares/expertAuth");
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
expertRouter.post("/resendOtp", (req, res) => expertController.resendOtp(req, res));
expertRouter.post("/verifyOtp", (req, res) => expertController.verifyOtp(req, res));
expertRouter.post("/login", (req, res) => expertController.login(req, res));
expertRouter.get("/getExpertDetails", expertAuth_1.expertAuth, (req, res) => expertController.getExpertDetails(req, res));
expertRouter.post("/editExpertProfile", expertAuth_1.expertAuth, (req, res) => expertController.editExpertProfile(req, res));
expertRouter.post("/opt_for_new_email", expertAuth_1.expertAuth, (req, res) => expertController.optForNewEmail(req, res));
expertRouter.post("/edit_expert_profile_picture", expertAuth_1.expertAuth, (req, res) => expertController.editExpertProfilePicture(req, res));
expertRouter.get("/status/:id", expertAuth_1.expertAuth, (req, res) => expertController.checkExpertStatus(req, res));
expertRouter.post("/verifyEmail", (req, res) => expertController.verifyEmailForPasswordReset(req, res));
expertRouter.post("/updatePassword", expertAuth_1.expertAuth, (req, res) => expertController.updatePassword(req, res));
expertRouter.post("/auth/refresh-token", (req, res) => expertController.refreshToken(req, res));
exports.default = expertRouter;
