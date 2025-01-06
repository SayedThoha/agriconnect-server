//userController.ts

import { Request, Response } from "express-serve-static-core";
import UserServices from "../services/userService";
import { Http_Status_Codes } from "../constants/httpStatusCodes";

class UserController {
  constructor(private userService: UserServices) {}

  async registerUserController(req: Request, res: Response): Promise<void> {
    console.log("Registering user...");

    try {
      // Validate required fields
      const requiredFields = ["firstName", "lastName", "email", "password"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Extract user data
      const { firstName, lastName, email, password } = req.body;

      // Call service to register user
      const result = await this.userService.registerUser({
        firstName,
        lastName,
        email,
        password,
      });

      // Respond based on service result
      if (result.success) {
        console.log("registration success");

        res.status(Http_Status_Codes.CREATED).json({ message: result.message });
      } else {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: result.message });
      }
    } catch (error) {
      console.error("Error in registerUserController:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server side error" });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = ["email"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email } = req.body;
      const result = await this.userService.resendOtp(email);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = ["email", "otp"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email, otp, role, new_email } = req.body;

      const result = await this.userService.verifyOtp(
        email,
        otp,
        role,
        new_email
      );

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = ["email", "password"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email, password } = req.body;
      console.log(email,password);
      
      const result = await this.userService.login(email, password);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        ...(result.accessToken && { accessToken: result.accessToken }),
        ...(result.accessedUser && { accessedUser: result.accessedUser }),
        ...(result.email && { email: result.email }),
      });
    } catch (error) {
      console.log(error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default UserController;
