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
const bookeSlotModel_1 = require("../../models/bookeSlotModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class BookedSlotRepository extends baseRepository_1.default {
    constructor() {
        super(bookeSlotModel_1.BookedSlot);
    }
    findBookedSlotsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookedSlots = yield bookeSlotModel_1.BookedSlot.find({ userId })
                    .populate({
                    path: "slotId",
                    populate: {
                        path: "expertId",
                    },
                })
                    .populate("userId")
                    .exec();
                return bookedSlots;
            }
            catch (error) {
                console.error("Error in findBookedSlotsByUser:", error);
                throw error;
            }
        });
    }
    findPendingAppointmentsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.find({ userId, consultation_status: "pending" })
                .populate({
                path: "slotId",
                model: "Slot",
            })
                .populate("userId")
                .populate("expertId");
        });
    }
    findBookedSlotById(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findById(appointmentId);
        });
    }
    findPendingAppointmentsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.find({ expertId, consultation_status: "pending" })
                .populate({
                path: "slotId",
                model: "Slot",
            })
                .populate("userId")
                .populate("expertId");
        });
    }
    findSlotByIdAndUpdate(slotId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate({ _id: slotId }, { $set: { roomId: roomId } });
        });
    }
    findSlotByIdAndUpdateStatus(slotId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate({ _id: slotId }, {
                $set: { consultation_status: status },
            });
        });
    }
}
exports.default = BookedSlotRepository;
