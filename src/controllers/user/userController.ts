//userController.ts

import { Request, Response } from "express";

import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import UserServices from "../../services/user/userService";
import {
  FarmerBookingDetails,
  PaymentRequest,
  SlotUpdateData,
} from "../../interfaces/commonInterface";

class UserController {
  constructor(private userService: UserServices) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    // console.log("Registering user...");

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
        // console.log("registration success");

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
      // console.log(email, password);

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
      // console.log("editUserProfile backend");
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
      // console.log("optForNewEmail backend");

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

  async checkUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      // console.log(userId);
      const status = await this.userService.checkUserStatus(userId);
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
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
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

  async getSpecialisation(req: Request, res: Response): Promise<void> {
    try {
      const specialisation = await this.userService.getSpecialisations();
      res.status(Http_Status_Codes.OK).json(specialisation);
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getExperts(req: Request, res: Response): Promise<void> {
    try {
      const expert = await this.userService.getExperts();
      res.status(Http_Status_Codes.OK).json(expert);
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
  async getExpertDetails(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query;
      // console.log(data);

      if (!data._id) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required data",
        });
        return;
      }

      const expert = await this.userService.getExpertDetails(
        data._id as string
      );
      // console.log(expert);
      res.status(Http_Status_Codes.OK).json(expert);
    } catch (error) {
      console.error("Error in getExpertDetails controller:", error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getExpertSlots(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query;

      if (!data._id) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required data",
        });
        return;
      }

      const expert = await this.userService.getExpertSlots(data._id as string);
      console.log(expert);
      res.status(Http_Status_Codes.OK).json(expert);
    } catch (error) {
      console.error("Error in getExpertSlotss controller:", error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async addSlots(req: Request, res: Response): Promise<void> {
    try {
      // console.log("addSlots backend");
      const slotData: SlotUpdateData = req.body;
      // console.log(slotData);

      const updatedSlot = await this.userService.bookSlot(slotData);
      // console.log("slots after booking:", updatedSlot);

      res.status(Http_Status_Codes.CREATED).json({
        message: "slot updated",
        slot: updatedSlot,
      });
    } catch (error) {
      console.error("Error in slot controller addSlots:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async getSlot(req: Request, res: Response): Promise<void> {
    try {
      // console.log("getSlot backend");
      const { slotId } = req.query;
      // console.log("Query data:", { slotId });

      const slot = await this.userService.getSlotDetails(slotId as string);
      // console.log("Retrieved slot:", slot);

      res.status(Http_Status_Codes.OK).json(slot);
    } catch (error) {
      console.error("Error in slot controller getSlot:", error);

      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async checkSlotAvailability(req: Request, res: Response): Promise<void> {
    try {
      // console.log("check_if_the_slot_available backend");
      const { slotId } = req.query;

      if (!slotId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "slot Id is missing" });
        return;
      }

      // console.log("slotId:", slotId, req.query);

      const { isAvailable, message } =
        await this.userService.checkSlotAvailability(slotId as string);

      if (!isAvailable) {
        res.status(Http_Status_Codes.UNAUTHORIZED).json({ message });
        return;
      }

      res.status(Http_Status_Codes.OK).json({ message });
    } catch (error) {
      console.error("Error in slot controller checkSlotAvailability:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async createBookingPayment(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    req: Request<{}, {}, PaymentRequest>,
    res: Response
  ): Promise<void> {
    try {
      // console.log("booking_payment backend");
      const { consultation_fee } = req.body;

      if (!consultation_fee || consultation_fee <= 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          message: "Invalid consultation fee",
        });
        return;
      }

      const paymentOrder = await this.userService.createPaymentOrder(
        consultation_fee
      );
      // console.log(paymentOrder);
      if (!paymentOrder.success) {
        res.status(Http_Status_Codes.BAD_REQUEST).json(paymentOrder);
        return;
      }

      res.status(Http_Status_Codes.OK).json(paymentOrder);
    } catch (error) {
      console.error("Error in user controller createBookingPayment:", error);

     

      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async appointmentBooking(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    req: Request<{}, {}, FarmerBookingDetails>,
    res: Response
  ): Promise<void> {
    try {
      // console.log("appointmnet_booking backend");
      const farmerDetails = req.body;
      console.log(farmerDetails);

      await this.userService.bookAppointment(farmerDetails);

      res
        .status(Http_Status_Codes.CREATED)
        .json({ message: "Slot booking completed" });
    } catch (error) {
      console.error("Error in appointment booking:", error);

     

      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }



  async userDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "User ID is required" });
        return;
      }

      const user = await this.userService.getUserDetails(userId as string);

      if (!user) {
        res
          .status(Http_Status_Codes.NOT_FOUND)
          .json({ message: "User not found" });
        return;
      }

      res.status(Http_Status_Codes.OK).json(user);
    } catch (error) {
      console.error("Error in userDetails controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log("get get_booking_details serverside");
      const { userId } = req.query;
      console.log("Query data:", { userId });

      if (!userId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }

      const bookedSlots = await this.userService.getBookingDetails(
        userId as string
      );
      res.status(Http_Status_Codes.OK).json(bookedSlots);
    } catch (error) {
      console.error("Error in getBookingDetails controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async cancelSlot(req: Request, res: Response): Promise<void> {
    try {
      console.log("get get_booking_details serverside");

      const { slotId } = req.query;
      console.log("Slot ID:", slotId);

      const response = await this.userService.cancelSlot(slotId as string);

      res.status(Http_Status_Codes.OK).json(response);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json("Internal Server Error");
    }
  }

  async upcomingAppointment(req: Request, res: Response): Promise<void> {
    try {
      console.log("Fetching upcoming appointment from server...");

      const userId = req.query._id as string;
      console.log("User ID:", userId);

      const appointment = await this.userService.getUpcomingAppointment(userId);

      if (Object.keys(appointment).length) {
        console.log("Next appointment:", appointment);
      } else {
        console.log("No upcoming appointments found.");
      }

      res.status(Http_Status_Codes.OK).json(appointment);
    } catch (error) {
      console.error("Error fetching upcoming appointment:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getUpcomingSlot(req: Request, res: Response): Promise<void> {
    try {
      // console.log(req.query);
      const { appointmentId } = req.query;

      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }

      const data = await this.userService.getUpcomingSlot(
        appointmentId as string
      );
      console.log("data:", data);

      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getPrescriptionDetails(req: Request, res: Response): Promise<void> {
    try {
      // console.log("get_prescription_details:", req.query);

      const { _id } = req.query;
      // console.log(_id)

      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required data" });
        return;
      }

      const data = await this.userService.getPrescriptionDetails(_id as string);
      // console.log("Prescription details:", data);

      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}

export default UserController;
