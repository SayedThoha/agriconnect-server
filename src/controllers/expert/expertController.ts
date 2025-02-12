import { Request, Response } from "express";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import ExpertService from "../../services/expert/expertService";
import { IExpertController } from "./IExpertController";

class ExpertController implements IExpertController {
  constructor(private expertService: ExpertService) {}

  async expertRegistration(req: Request, res: Response): Promise<void> {
    try {
      console.log("expert registration backend", req.body);

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
      console.log(result);

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
      console.log("entering the login in expert");
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
      console.log("Edit profile of expert - server side");
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
      console.log("optForNewEmail backend");

      const { expertId, email } = req.body;

      if (!expertId || !email) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "User ID and email are required" });
        return;
      }

      const message = await this.expertService.optForNewEmail(expertId, email);

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

  async editExpertProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      console.log("Raw Request Body:", req.body);

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
      console.log(expertId);
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

  async createSlot(req: Request, res: Response): Promise<void> {
    try {
      console.log("add slot serverside");
      const data = req.body;
      console.log("data from adding slot", data);

      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "Slot adding Failed, no data passed to server side",
        });
        return;
      }

      const result = await this.expertService.createSlot(data);
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Error in createSlot controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    }
  }

  async addAllSlots(req: Request, res: Response): Promise<void> {
    try {
      const { expertId, slots } = req.body;

      if (!expertId || !Array.isArray(slots) || slots.length === 0) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      const addedSlots = await this.expertService.addAllSlots(expertId, slots);

      res.status(201).json(addedSlots);
    } catch (error) {
      console.error("Error adding slots:", error);
      res.status(500).json({ message: "Internal Server Error", error: error });
      return;
    }
  }

  async expertSlotDetails(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.query;

      if (typeof _id !== "string") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "slot adding Failed, Missing fields",
        });
        return;
      }

      const slots = await this.expertService.getExpertSlotDetails(_id);

      res.status(Http_Status_Codes.OK).json(slots);
    } catch (error) {
      console.log(error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async removeSlot(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.query;
      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Slot ID is required" });
        return;
      }

      const response = await this.expertService.removeSlot(_id as string);
      res.status(response.statusCode).json({ message: response.message });
      return;
    } catch (error) {
      console.error("Error in removeSlot controller:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log("get_booking_details serverside");

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

  async upcomingAppointment(req: Request, res: Response): Promise<void> {
    try {
      console.log("Fetching upcoming appointment from server...");

      const { expertId } = req.query;
      console.log("expert ID:", expertId);

      const appointment = await this.expertService.getUpcomingAppointment(
        expertId as string
      );

      if (Object.keys(appointment).length) {
        // console.log("Next appointment:", appointment);
        
      } else {
        // console.log("No upcoming appointments found.");
        // res.status(Http_Status_Codes.OK).json({});
      }

      res.status(Http_Status_Codes.OK).json(appointment);
      
    } catch (error) {
      console.error("Error fetching upcoming appointment:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async updateUpcomingSlot(req: Request, res: Response): Promise<void> {
    try {
      // console.log(req.query);
      const { appointmentId, roomId } = req.query;

      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }

      const data = await this.expertService.updateUpcomingSlot(
        appointmentId as string,
        roomId as string
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

  async updateSlotStatus(req: Request, res: Response): Promise<void> {
    try {
      // console.log(req.query);
      const { appointmentId, status } = req.query;

      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }

      const data = await this.expertService.updateSlotStatus(
        appointmentId as string,
        status as string
      );

      console.log("data:", data);

      res
        .status(Http_Status_Codes.OK)
        .json({ message: "consultation status updated" });
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getExpertBookings(req: Request, res: Response): Promise<void> {
    try {
      console.log("get_bookings_of_details serverside");
      const { expertId } = req.query;
      console.log(expertId);

      // Validate query data
      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Invalid query parameters",
        });
        return;
      }

      // Retrieve bookings
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

  async addPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, issue, prescription } = req.query;
      // console.log(appointmentId,issue,prescription)

      if (!appointmentId || !issue || !prescription) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required fields",
        });
        return;
      }

      // Add prescription
      const newPrescription = await this.expertService.addPrescription(
        appointmentId.toString(),
        issue.toString(),
        prescription.toString()
      );

      res.status(Http_Status_Codes.CREATED).json({
        message: "Prescription added",
        prescription: newPrescription,
      });
    } catch (error) {
      console.error("Error in addPrescription:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  async shareRoomIdThroughEmail(req: Request, res: Response): Promise<void> {
    try {
      console.log("shareRoomIdThroughEmail server-side");

      const { roomId, slotId } = req.query;
      console.log("roomId",roomId);
      console.log("slotId",slotId)
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

      console.log("response after sending room id",response)

      res.status(Http_Status_Codes.OK).json(response);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }


  async getPrescriptionDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log("get_prescription_details:", req.query);

      const { _id } = req.query;
      console.log(_id)

      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required data" });
        return;
      }

      const data = await this.expertService.getPrescriptionDetails(_id as string);
      console.log("Prescription details:", data);

      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }


}

export default ExpertController;
