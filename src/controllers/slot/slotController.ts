import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import SlotService from "../../services/slot/slotService";
import { Request, Response } from "express";
import { ISlotController } from "./ISlotController";

class SlotController implements ISlotController {
  constructor(private slotService: SlotService) {}

  async createSlot(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "Slot adding Failed, no data passed to server side",
        });

        return;
      }

      const result = await this.slotService.createSlot(data);
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

      const addedSlots = await this.slotService.addAllSlots(expertId, slots);

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

      const slots = await this.slotService.getExpertSlotDetails(_id);

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

      const response = await this.slotService.removeSlot(_id as string);
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
}

export default SlotController;
