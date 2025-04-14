//adminRoutes.ts
import express from "express";
import AdminRepository from "../repositories/admin/adminRepository";
import AdminServices from "../services/admin/adminService";
import AdminController from "../controllers/admin/adminController";
import adminAuth from "../middlewares/adminAuth";

const adminRouter = express.Router();

const adminRepository = new AdminRepository();
const adminService = new AdminServices(adminRepository);
const adminController = new AdminController(adminService);

adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", adminAuth, (req, res) =>
  adminController.getAdminDashboardDetails(req, res)
);

adminRouter.get("/expertdata", adminAuth, (req, res) =>
  adminController.getExperts(req, res)
);
adminRouter.post("/expertBlock", adminAuth, (req, res) =>
  adminController.toggleExpertStatus(req, res)
);
adminRouter.post("/searchExpert", adminAuth, (req, res) =>
  adminController.searchExperts(req, res)
);


adminRouter.get("/userdata", adminAuth, (req, res) =>
  adminController.getUsers(req, res)
);
adminRouter.post("/userBlock", adminAuth, (req, res) =>
  adminController.toggleBlockStatus(req, res)
);
adminRouter.post("/userDetails", adminAuth, (req, res) =>
  adminController.getUserDetails(req, res)
);
adminRouter.post("/searchUser", adminAuth, (req, res) =>
  adminController.searchUsers(req, res)
);

adminRouter.get("/getSpecialisation", adminAuth, (req, res) =>
  adminController.getSpecialisations(req, res)
);

adminRouter.post("/addSpecialisation", adminAuth, (req, res) =>
  adminController.addSpecialisation(req, res)
);

adminRouter.post("/editSpecialisation", adminAuth, (req, res) =>
  adminController.editSpecialisation(req, res)
);

adminRouter.delete("/deleteSpecialisation", adminAuth, (req, res) =>
  adminController.deleteSpecialisation(req, res)
);


adminRouter.get("/kycDataCollection", adminAuth, (req, res) =>
  adminController.getKycData(req, res)
);

adminRouter.get("/get_kyc_details_of_expert", adminAuth, (req, res) =>
  adminController.getExpertKycDetails(req, res)
);

adminRouter.post("/submit_kyc_details", adminAuth, (req, res) =>
  adminController.submitKycDetails(req, res)
);


adminRouter.post("/editpayOut", (req, res) =>
  adminController.editPayOut(req, res)
);

adminRouter.get("/get_appointment_details", (req, res) =>
  adminController.getAppointmentDetails(req, res)
);

export default adminRouter;
