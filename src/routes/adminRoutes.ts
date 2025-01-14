//adminRoutes.ts
import express from "express";
import AdminRepository from "../repositories/admin/adminRepository";
import AdminServices from "../services/adminService";
import AdminController from "../controllers/adminController";

const adminRouter = express.Router();

const adminRepository = new AdminRepository();
const adminService = new AdminServices(adminRepository);
const adminController = new AdminController(adminService);

adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", (req, res) =>
  adminController.getAdminDashboardDetails(req, res)
);

//experts
adminRouter.get("/expertdata", (req, res) =>
  adminController.getExperts(req, res)
);
adminRouter.post("/expertBlock", (req, res) =>
  adminController.toggleExpertStatus(req, res)
);

//users
adminRouter.get("/userdata", (req, res) => adminController.getUsers(req, res));
adminRouter.post("/userBlock", (req, res) =>
  adminController.toggleBlockStatus(req, res)
);
adminRouter.post("/userDetails", (req, res) =>
  adminController.getUserDetails(req, res)
);
adminRouter.post("/searchUser", (req, res) =>
  adminController.searchUsers(req, res)
);

//specialisation
adminRouter.get("/getSpecialisation", (req, res) =>
  adminController.getSpecialisations(req, res)
);

adminRouter.post("/addSpecialisation", (req, res) =>
  adminController.addSpecialisation(req, res)
);

adminRouter.post("/editSpecialisation", (req, res) =>
  adminController.editSpecialisation(req, res)
);

adminRouter.delete("/deleteSpecialisation", (req, res) =>
  adminController.deleteSpecialisation(req, res)
);

//kyc

adminRouter.get("/kycDataCollection", (req, res) =>
  adminController.getKycData(req, res)
);

adminRouter.get("/get_kyc_details_of_expert", (req, res) =>
  adminController.getExpertKycDetails(req, res)
);

adminRouter.post("/submit_kyc_details",(req,res)=>adminController.submitKycDetails(req,res));
// adminRouter.get("/download_kyc_documents",
//   (req,res)=>adminController.downloadKycDocuments(req,res))

export default adminRouter;
