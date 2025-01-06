import express from "express";
import AdminRepository from "../repositories/admin/adminRepository";
import AdminServices from "../services/adminService";
import AdminController from "../controllers/adminController";

const adminRouter = express.Router();

const admintRepository = new AdminRepository();
const adminService = new AdminServices(admintRepository);
const adminController = new AdminController(adminService);

adminRouter.post("/login", (req, res) => adminController.login(req, res));
adminRouter.get("/get_admin_dashboard_details", (req, res) =>
  adminController.getAdminDashboardDetails(req, res)
);

export default adminRouter;
