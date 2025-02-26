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
class SlotController {
    constructor(slotService) {
        this.slotService = slotService;
    }
    createSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "Slot adding Failed, no data passed to server side",
                    });
                    return;
                }
                const result = yield this.slotService.createSlot(data);
                res.status(result.statusCode).json(result);
            }
            catch (error) {
                console.error("Error in createSlot controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: "Internal Server Error",
                });
            }
        });
    }
    addAllSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId, slots } = req.body;
                if (!expertId || !Array.isArray(slots) || slots.length === 0) {
                    res.status(400).json({ message: "Invalid input data" });
                    return;
                }
                const addedSlots = yield this.slotService.addAllSlots(expertId, slots);
                res.status(201).json(addedSlots);
            }
            catch (error) {
                console.error("Error adding slots:", error);
                res.status(500).json({ message: "Internal Server Error", error: error });
                return;
            }
        });
    }
    expertSlotDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (typeof _id !== "string") {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "slot adding Failed, Missing fields",
                    });
                    return;
                }
                const slots = yield this.slotService.getExpertSlotDetails(_id);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(slots);
            }
            catch (error) {
                console.log(error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    removeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Slot ID is required" });
                    return;
                }
                const response = yield this.slotService.removeSlot(_id);
                res.status(response.statusCode).json({ message: response.message });
                return;
            }
            catch (error) {
                console.error("Error in removeSlot controller:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
                return;
            }
        });
    }
    //user
    getExpertSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                if (!data._id) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required data",
                    });
                    return;
                }
                const expert = yield this.slotService.getExpertSlots(data._id);
                console.log(expert);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(expert);
            }
            catch (error) {
                console.error("Error in getExpertSlotss controller:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    addSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("addSlots backend");
                const slotData = req.body;
                // console.log(slotData);
                const updatedSlot = yield this.slotService.bookSlot(slotData);
                // console.log("slots after booking:", updatedSlot);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({
                    message: "slot updated",
                    slot: updatedSlot,
                });
            }
            catch (error) {
                console.error("Error in slot controller addSlots:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
    getSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("getSlot backend");
                const { slotId } = req.query;
                // console.log("Query data:", { slotId });
                const slot = yield this.slotService.getSlotDetails(slotId);
                // console.log("Retrieved slot:", slot);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(slot);
            }
            catch (error) {
                console.error("Error in slot controller getSlot:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal server error" });
            }
        });
    }
}
exports.default = SlotController;
