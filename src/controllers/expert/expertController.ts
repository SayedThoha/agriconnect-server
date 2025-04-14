/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import ExpertService from "../../services/expert/expertService";
import { IExpertController } from "./IExpertController";

class ExpertController implements IExpertController {
  constructor(private expertService: ExpertService) {}

  async expertRegistration(req: Request, res: Response): Promise<void> {
    try {
      const missingFields = this.expertService.validateRegistrationData(
        req.body
      );
      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }
      const result = await this.expertService.registerExpert(req.body);
      if (!result.status) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: result.message });
        return;
      }
      res.status(Http_Status_Codes.CREATED).json({ message: result.message });
    } catch (error) {
      console.log("error due to expert registration:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getSpecialisation(req: Request, res: Response): Promise<void> {
    try {
      const specialisation = await this.expertService.getSpecialisations();
      res.status(Http_Status_Codes.OK).json({ specialisation });
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
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
      const result = await this.expertService.resendOtp(email);
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

      const result = await this.expertService.verifyOtp(
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
      const result = await this.expertService.loginExpert(email, password);

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
  async getExpertDetails(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.query;
      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Expert ID is required" });
        return;
      }
      const expert = await this.expertService.getExpertDetails(_id as string);

      if (!expert) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: "Expert not found" });
        return;
      }
      res.status(Http_Status_Codes.OK).json(expert);
    } catch (error) {
      console.error("Error in getExpertDetails controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async editExpertProfile(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      if (!data._id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Expert ID is required" });
        return;
      }

      const updatedExpert = await this.expertService.editExpertProfile(
        data._id,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          contactno: data.contactno,
          experience: data.experience,
          consultation_fee: data.consultation_fee,
        }
      );
      if (!updatedExpert) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: "Expert not found" });
        return;
      }
      res
        .status(Http_Status_Codes.OK)
        .json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error in editExpertProfile controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async optForNewEmail(req: Request, res: Response): Promise<void> {
    try {
      const { expertId, email } = req.body;
      if (!expertId || !email) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "User ID and email are required" });
        return;
      }
      const message = await this.expertService.optForNewEmail(expertId, email);

      res.status(Http_Status_Codes.OK).json({ message });
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

  async editExpertProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const { expertId, image_url } = req.body;
      if (!expertId || !image_url) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required fields" });
        return;
      }
      const message = await this.expertService.editExpertProfilePicture(
        expertId,
        image_url
      );
      res.status(Http_Status_Codes.OK).json({ message });
    } catch (error) {
      console.error("Error in editExpertProfilePicture controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
  async checkExpertStatus(req: Request, res: Response): Promise<void> {
    try {
      const expertId = req.params.id;
      const status = await this.expertService.checkExpertStatus(expertId);
      res.status(200).json(status);
    } catch (error) {
      console.error("Error in checkUserStatus:", error);

      res.status(500).json({ message: "Internal server error" });
    }
  }
  async verifyEmailForPasswordReset(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const requiredFields = ["email"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }
      const { email } = req.body;
      await this.expertService.verifyEmailForPasswordReset(email);
      res.status(Http_Status_Codes.OK).json({
        message: "Email verification done",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const requiredFields = ["email", "password"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }
      const { email, password } = req.body;
      const result = await this.expertService.updatePassword(email, password);
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
  }

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
      const response = await this.expertService.refreshToken(refreshToken);
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
  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      const { expertId } = req.query;
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required data",
        });
        return;
      }
      const bookings = await this.expertService.getBookingDetails(
        expertId as string
      );
      res.status(Http_Status_Codes.OK).json(bookings);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getExpertDashboardDetails(req: Request, res: Response): Promise<void> {
    try {
      const { expertId } = req.query;
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "expert ID is required",
        });
        return;
      }
      const bookedSlots = await this.expertService.getExpertDashboardDetails(
        expertId as string
      );
      res.status(Http_Status_Codes.OK).json(bookedSlots);
    } catch (error) {
      console.error("Error in get dashboard controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getExpertBookings(req: Request, res: Response): Promise<void> {
    try {
      const { expertId } = req.query;
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Invalid query parameters",
        });
        return;
      }
      const bookings = await this.expertService.getExpertBookings(
        expertId as string
      );
      res.status(Http_Status_Codes.OK).json(bookings);
    } catch (error) {
      console.error("Error fetching doctor bookings:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async shareRoomIdThroughEmail(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, slotId } = req.query;

      if (!roomId || !slotId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required field" });
        return;
      }

      const response = await this.expertService.shareRoomIdService(
        slotId as string,
        roomId as string
      );

      res.status(Http_Status_Codes.OK).json(response);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }
}

export default ExpertController;
