"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repositories/admin/adminRepository"));
const adminService_1 = __importDefault(require("../services/adminService"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminRouter = express_1.default.Router();
const admintRepository = new adminRepository_1.default();
const adminService = new adminService_1.default(admintRepository);
const adminController = new adminController_1.default(adminService);
adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", (req, res) => adminController.getAdminDashboardDetails(req, res));
exports.default = adminRouter;
