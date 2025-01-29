//userController.ts

import { Request, Response } from "express";

import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import UserServices from "../../services/user/userService";

class UserController {
  constructor(private userService: UserServices) {}

  async registerUser(req: Request, res: Response): Promise<void> {
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
      console.log(email, password);

      const result = await this.userService.login(email, password);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        ...(result.accessToken && { accessToken: result.accessToken }),
        ...(result.refreshToken && { refreshToken: result.refreshToken }),
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

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.query;

      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "User ID is required" });
        return;
      }

      const user = await this.userService.getUserDetails(_id as string);

      if (!user) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: "User not found" });
        return;
      }

      res.status(Http_Status_Codes.OK).json(user);
    } catch (error) {
      console.error("Error in getExpertDetails controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async editUserProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log("editUserProfile backend");
      const { _id, firstName, lastName, email } = req.body;

      console.log(
        `id :${_id} firstName:${firstName} secondName:${lastName} email:${email}`
      );

      if (!_id || !firstName || !lastName || !email) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "All fields are required" });
        return;
      }

      const updatedUser = await this.userService.editUserProfile(_id, {
        firstName,
        lastName,
        email,
      });

      if (!updatedUser) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: "User not found" });
        return;
      }

      res
        .status(Http_Status_Codes.OK)
        .json({ message: "profile updated sucessfully", data: updatedUser });
    } catch (error) {
      console.error("Error in editUserProfile controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async optForNewEmail(req: Request, res: Response): Promise<void> {
    try {
      console.log("optForNewEmail backend");

      const { userId, email } = req.body;

      if (!userId || !email) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "User ID and email are required" });
        return;
      }

      const message = await this.userService.optForNewEmail(userId, email);

      res.status(Http_Status_Codes.OK).json({ message });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in optForNewEmail controller:", error);

      if (error.message === "Existing email. Try another") {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        res
          .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal Server Error" });
      }
    }
  }

  async editUserProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const { userId, image_url } = req.body;

      if (!userId || !image_url) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required fields" });
        return;
      }

      const message = await this.userService.editUserProfilePicture(
        userId,
        image_url
      );
      res.status(Http_Status_Codes.OK).json({ message });
    } catch (error) {
      console.error("Error in editUserProfilePicture controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async checkUserStatus(req: Request, res: Response): Promise<void>  {
    try {
      const userId = req.params.id;
      console.log(userId);
      const status = await this.userService.checkUserStatus(userId);
      res.status(200).json(status);
    } catch (error) {
      console.error("Error in checkUserStatus:", error);

      res.status(500).json({ message: "Internal server error" });
    }
  };

  async verifyEmailForPasswordReset( req: Request,res: Response):Promise<void> {
    try {
      // Input validation
      const requiredFields = ["email"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email } = req.body;

      await this.userService.verifyEmailForPasswordReset(email);

      res.status(Http_Status_Codes.OK).json({
        message: "Email verification done",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  };

 async updatePassword (req: Request, res: Response): Promise<void> {
    try {
      // Validation
      const requiredFields = ["email", "password"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email, password } = req.body;
      const result = await this.userService.updatePassword(email, password);

      if (!result.status) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: result.message });
        return;
      }

      res.status(Http_Status_Codes.OK).json({ message: result.message });
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  };

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(Http_Status_Codes.BAD_REQUEST).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    try {
      // Call the refreshToken method from UserService
      const response = await this.userService.refreshToken(refreshToken);

      res.status(response.statusCode).json(response);
      return;
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
      return;
    }
  }
}

export default UserController;
