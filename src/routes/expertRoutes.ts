import express from "express";
import ExpertRepository from "../repositories/expert/expertRepository";
import ExpertServices from "../services/expertService";
import ExpertController from "../controllers/expertController";
import upload from "../utils/multer";
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

expertRouter.post("/resend-otp", (req, res) =>
  expertController.resendOtp(req, res)
);

expertRouter.post("/verifyOtp", (req, res) =>
  expertController.verifyOtp(req, res)
);

expertRouter.post("/login", (req, res) => expertController.login(req, res));

export default expertRouter;
