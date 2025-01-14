"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repositories/admin/adminRepository"));
const adminService_1 = __importDefault(require("../services/adminService"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminRouter = express_1.default.Router();
const adminRepository = new adminRepository_1.default();
const adminService = new adminService_1.default(adminRepository);
const adminController = new adminController_1.default(adminService);
adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", (req, res) => adminController.getAdminDashboardDetails(req, res));
//experts
adminRouter.get("/expertdata", (req, res) => adminController.getExperts(req, res));
adminRouter.post("/expertBlock", (req, res) => adminController.toggleExpertStatus(req, res));
//users
adminRouter.get("/userdata", (req, res) => adminController.getUsers(req, res));
adminRouter.post("/userBlock", (req, res) => adminController.toggleBlockStatus(req, res));
adminRouter.post("/userDetails", (req, res) => adminController.getUserDetails(req, res));
adminRouter.post("/searchUser", (req, res) => adminController.searchUsers(req, res));
//specialisation
adminRouter.get("/getSpecialisation", (req, res) => adminController.getSpecialisations(req, res));
adminRouter.post("/addSpecialisation", (req, res) => adminController.addSpecialisation(req, res));
adminRouter.post("/editSpecialisation", (req, res) => adminController.editSpecialisation(req, res));
adminRouter.delete("/deleteSpecialisation", (req, res) => adminController.deleteSpecialisation(req, res));
//kyc
adminRouter.get("/kycDataCollection", (req, res) => adminController.getKycData(req, res));
adminRouter.get("/get_kyc_details_of_expert", (req, res) => adminController.getExpertKycDetails(req, res));
adminRouter.post("/submit_kyc_details", (req, res) => adminController.submitKycDetails(req, res));
// adminRouter.get("/download_kyc_documents",
//   (req,res)=>adminController.downloadKycDocuments(req,res))
exports.default = adminRouter;
