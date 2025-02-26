"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repositories/admin/adminRepository"));
const adminService_1 = __importDefault(require("../services/admin/adminService"));
const adminController_1 = __importDefault(require("../controllers/admin/adminController"));
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const adminRouter = express_1.default.Router();
const adminRepository = new adminRepository_1.default();
const adminService = new adminService_1.default(adminRepository);
const adminController = new adminController_1.default(adminService);
adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", adminAuth_1.default, (req, res) => adminController.getAdminDashboardDetails(req, res));
//experts
adminRouter.get("/expertdata", adminAuth_1.default, (req, res) => adminController.getExperts(req, res));
adminRouter.post("/expertBlock", adminAuth_1.default, (req, res) => adminController.toggleExpertStatus(req, res));
adminRouter.post("/searchExpert", adminAuth_1.default, (req, res) => adminController.searchExperts(req, res));
//users
adminRouter.get("/userdata", adminAuth_1.default, (req, res) => adminController.getUsers(req, res));
adminRouter.post("/userBlock", adminAuth_1.default, (req, res) => adminController.toggleBlockStatus(req, res));
adminRouter.post("/userDetails", adminAuth_1.default, (req, res) => adminController.getUserDetails(req, res));
adminRouter.post("/searchUser", adminAuth_1.default, (req, res) => adminController.searchUsers(req, res));
//specialisation
adminRouter.get("/getSpecialisation", adminAuth_1.default, (req, res) => adminController.getSpecialisations(req, res));
adminRouter.post("/addSpecialisation", adminAuth_1.default, (req, res) => adminController.addSpecialisation(req, res));
adminRouter.post("/editSpecialisation", adminAuth_1.default, (req, res) => adminController.editSpecialisation(req, res));
adminRouter.delete("/deleteSpecialisation", adminAuth_1.default, (req, res) => adminController.deleteSpecialisation(req, res));
//kyc
adminRouter.get("/kycDataCollection", adminAuth_1.default, (req, res) => adminController.getKycData(req, res));
adminRouter.get("/get_kyc_details_of_expert", adminAuth_1.default, (req, res) => adminController.getExpertKycDetails(req, res));
adminRouter.post("/submit_kyc_details", adminAuth_1.default, (req, res) => adminController.submitKycDetails(req, res));
adminRouter.post("/editpayOut", (req, res) => adminController.editPayOut(req, res));
adminRouter.get("/get_appointment_details", (req, res) => adminController.getAppointmentDetails(req, res));
exports.default = adminRouter;
