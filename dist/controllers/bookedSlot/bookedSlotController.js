"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class BookedSlotController {
    constructor(bookedSlotService) {
        this.bookedSlotService = bookedSlotService;
    }
    // user
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                if (!userId) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "User ID is required",
                    });
                    return;
                }
                const bookedSlots = yield this.bookedSlotService.getBookingDetails(userId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(bookedSlots);
            }
            catch (error) {
                console.error("Error in getBookingDetails controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getUpcomingSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                const data = yield this.bookedSlotService.getUpcomingSlot(appointmentId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(data);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    upcomingAppointment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query._id;
                const appointment = yield this.bookedSlotService.getUpcomingAppointment(userId);
                if (Object.keys(appointment).length) {
                    // console.log("Next appointment:", appointment);
                }
                else {
                    // console.log("No upcoming appointments found.");
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(appointment);
            }
            catch (error) {
                console.error("Error fetching upcoming appointment:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    // expert
    upcomingAppointmentByExpert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                const appointment = yield this.bookedSlotService.getUpcomingAppointmentByExpert(expertId);
                if (Object.keys(appointment).length) {
                    // console.log("Next appointment:", appointment);
                }
                else {
                    // console.log("No upcoming appointments found.");
                    // res.status(Http_Status_Codes.OK).json({});
                }
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(appointment);
            }
            catch (error) {
                console.error("Error fetching upcoming appointment:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    updateUpcomingSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId, roomId } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                const data = yield this.bookedSlotService.updateUpcomingSlot(appointmentId, roomId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(data);
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    updateSlotStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId, status } = req.query;
                if (!appointmentId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Appointment ID is required" });
                    return;
                }
                yield this.bookedSlotService.updateSlotStatus(appointmentId, status);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.OK)
                    .json({ message: "consultation status updated" });
            }
            catch (error) {
                console.error(error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = BookedSlotController;
