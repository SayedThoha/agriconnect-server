import express from "express";
import ExpertRepository from "../repositories/expert/expertRepository";
import ExpertServices from "../services/expert/expertService";
import ExpertController from "../controllers/expert/expertController";
import upload from "../utils/multer";
import { expertAuth } from "../middlewares/expertAuth";

const expertRouter = express.Router();

const expertRepository = new ExpertRepository();
const expertService = new ExpertServices(expertRepository);
const expertController = new ExpertController(expertService);

expertRouter.post(
  "/registration",
  upload.fields([
    { name: "identity_proof", maxCount: 1 },
    { name: "expert_licence", maxCount: 1 },
    { name: "profile_picture", maxCount: 1 },
    { name: "qualification_certificate" },
    { name: "experience_certificate" },
  ]),
  (req, res, next) => {
    console.log("Incoming request:", req.body);
    console.log("Incoming files:", req.files);
    next();
  },
  (req, res) => expertController.expertRegistration(req, res)
);
expertRouter.get("/specialisation", (req, res) =>
  expertController.getSpecialisation(req, res)
);

expertRouter.post("/resendOtp", (req, res) =>
  expertController.resendOtp(req, res)
);

expertRouter.post("/verifyOtp", (req, res) =>
  expertController.verifyOtp(req, res)
);

expertRouter.post("/login", (req, res) => expertController.login(req, res));

expertRouter.get("/getExpertDetails", expertAuth, (req, res) =>
  expertController.getExpertDetails(req, res)
);

expertRouter.post("/editExpertProfile", expertAuth, (req, res) =>
  expertController.editExpertProfile(req, res)
);

expertRouter.post("/opt_for_new_email", expertAuth, (req, res) =>
  expertController.optForNewEmail(req, res)
);

expertRouter.post("/edit_expert_profile_picture", expertAuth, (req, res) =>
  expertController.editExpertProfilePicture(req, res)
);

expertRouter.get("/status/:id",expertAuth, (req, res) =>
  expertController.checkExpertStatus(req, res)
);

expertRouter.post("/verifyEmail", (req, res) =>
  expertController.verifyEmailForPasswordReset(req, res)
);

expertRouter.post("/updatePassword",expertAuth, (req, res) =>
  expertController.updatePassword(req, res)
);

expertRouter.post("/auth/refresh-token", (req, res) =>
  expertController.refreshToken(req, res)
);
export default expertRouter;
