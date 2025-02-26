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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const mongoose_1 = __importDefault(require("mongoose"));
class SlotService {
    constructor(slotRepository) {
        this.slotRepository = slotRepository;
    }
    // expert
    convertToLocalDate(date) {
        const utcDate = new Date(date);
        return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    }
    createSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert dates
                const slotLocalDate = this.convertToLocalDate(slotData.time);
                const currentLocalDate = this.convertToLocalDate(new Date());
                // Check if slot exists
                const existingSlot = yield this.slotRepository.findSlotByExpertIdAndTime(slotData._id, slotData.time);
                if (existingSlot) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.CONFLICT,
                        message: "Slot already exists",
                    };
                }
                if (slotLocalDate <= currentLocalDate) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.CONFLICT,
                        message: "The selected slot is no longer available",
                    };
                }
                // Get required data
                const [admin, expert] = yield Promise.all([
                    this.slotRepository.findAdminSettings(),
                    this.slotRepository.findExpertById(slotData._id),
                ]);
                if (!expert) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "Expert not found",
                    };
                }
                // Convert string ID to ObjectId
                const expertObjectId = new mongoose_1.default.Types.ObjectId(slotData._id);
                // Create slot data
                const newSlotData = {
                    expertId: expertObjectId,
                    time: slotData.time,
                    booked: false,
                    cancelled: false,
                    adminPaymentAmount: admin[0].payOut,
                    bookingAmount: expert.consultation_fee,
                    created_time: new Date(),
                };
                // Create slot
                const slot = yield this.slotRepository.createSlot(newSlotData);
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.CREATED,
                    message: "Slot created successfully",
                    data: slot,
                };
            }
            catch (error) {
                console.error("Error in createSlot:", error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: error instanceof Error ? error.message : "Error creating slot",
                };
            }
        });
    }
    addAllSlots(expertId, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId || !slots.length) {
                throw new Error("Expert ID and slots are required");
            }
            const [admin, expert] = yield Promise.all([
                this.slotRepository.findAdminSettings(),
                this.slotRepository.findExpertById(expertId),
            ]);
            // console.log(admin);
            if (!admin || !expert) {
                throw new Error("Admin or expert not found");
            }
            const slotData = slots.map((time) => ({
                expertId: new mongoose_1.default.Types.ObjectId(expertId),
                time,
                adminPaymentAmount: admin[0].payOut,
                bookingAmount: expert.consultation_fee,
                booked: false,
                cancelled: false,
                created_time: new Date(),
            }));
            return this.slotRepository.createMultipleSlots(slotData);
        });
    }
    getExpertSlotDetails(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            // console.log(expertId);
            try {
                return yield this.slotRepository.findSlotsByExpertId(expertId, currentTime);
            }
            catch (error) {
                throw new Error(`Error fetching expert slot details: ${error}`);
            }
        });
    }
    removeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("Removing slot with ID:", slotId);
                // Find slot
                const slot = yield this.slotRepository.findSlotById(slotId);
                if (!slot) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.NOT_FOUND,
                        message: "Slot not found",
                    };
                }
                // Check if slot is booked
                if (slot.booked) {
                    return {
                        success: false,
                        statusCode: httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST,
                        message: "Slot is already booked and cannot be removed.",
                    };
                }
                // Delete slot
                yield this.slotRepository.deleteSlotById(slotId);
                return {
                    success: true,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.OK,
                    message: "Slot successfully deleted",
                };
            }
            catch (error) {
                console.error("Error in removeSlot:", error);
                return {
                    success: false,
                    statusCode: httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR,
                    message: error instanceof Error ? error.message : "Error deleting slot",
                };
            }
        });
    }
    //user
    getExpertSlots(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slots = yield this.slotRepository.getSlots(expertId);
                return slots;
            }
            catch (error) {
                console.error("Error in getExpertSlots service:", error);
                throw error;
            }
        });
    }
    bookSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSlot = yield this.slotRepository.updateSlotBooking(slotData);
                if (!updatedSlot) {
                    throw new Error("Slot not found or could not be updated");
                }
                return updatedSlot;
            }
            catch (error) {
                console.error("Error in slot service bookSlot:", error);
                throw error;
            }
        });
    }
    getSlotDetails(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield this.slotRepository.userFindSlotById(slotId);
                if (!slot) {
                    throw new Error("Slot not found");
                }
                return slot;
            }
            catch (error) {
                console.error("Error in slot service getSlotDetails:", error);
                throw error;
            }
        });
    }
}
exports.default = SlotService;
