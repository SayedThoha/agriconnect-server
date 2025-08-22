import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { Request, Response } from "express";
import { IBookedSlotController } from "./IBookedSlotController";
import { IBookedSlotService } from "../../services/bookedSlot/IBookedSlotService";

class BookedSlotController implements IBookedSlotController {
  constructor(private bookedSlotService: IBookedSlotService) {}

  async getBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      if (!userId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      const bookedSlots = await this.bookedSlotService.getBookingDetails(
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

  async getUpcomingSlot(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.query;
      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }
      const data = await this.bookedSlotService.getUpcomingSlot(
        appointmentId as string
      );
      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async upcomingAppointment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query._id as string;
      const appointment = await this.bookedSlotService.getUpcomingAppointment(
        userId
      );

      res.status(Http_Status_Codes.OK).json(appointment);
    } catch (error) {
      console.error("Error fetching upcoming appointment:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // expert
  async upcomingAppointmentByExpert(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { expertId } = req.query;
      const appointment =
        await this.bookedSlotService.getUpcomingAppointmentByExpert(
          expertId as string
        );

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
      const { appointmentId, roomId } = req.query;
      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }
      const data = await this.bookedSlotService.updateUpcomingSlot(
        appointmentId as string,
        roomId as string
      );
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
      const { appointmentId, status } = req.query;

      if (!appointmentId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Appointment ID is required" });
        return;
      }
      await this.bookedSlotService.updateSlotStatus(
        appointmentId as string,
        status as string
      );

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
}

export default BookedSlotController;
