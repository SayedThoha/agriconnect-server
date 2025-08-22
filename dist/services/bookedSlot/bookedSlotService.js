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
class BookedSlotService {
    constructor(bookedSlotRepository) {
        this.bookedSlotRepository = bookedSlotRepository;
    }
    getBookingDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const bookings = yield this.bookedSlotRepository.findBookedSlotsByUser(userId);
                return bookings;
            }
            catch (error) {
                console.error("Error in getBookingDetails service:", error);
                throw error;
            }
        });
    }
    getUpcomingSlot(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.bookedSlotRepository.findBookedSlotById(appointmentId);
            if (!data) {
                throw new Error("Appointment not found");
            }
            return data;
        });
    }
    getUpcomingAppointment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const margin = 15 * 60 * 1000;
            const bookedSlots = yield this.bookedSlotRepository.findPendingAppointmentsByUser(userId);
            const upcomingAppointments = bookedSlots.filter((slot) => {
                if (!slot.slotId ||
                    typeof slot.slotId !== "object" ||
                    !("time" in slot.slotId) ||
                    !(typeof slot.slotId.time === "string" ||
                        typeof slot.slotId.time === "number" ||
                        slot.slotId.time instanceof Date)) {
                    console.error("Invalid slotId:", slot.slotId);
                    return false;
                }
                const slotTime = new Date(slot.slotId.time);
                return slotTime.getTime() > now.getTime() - margin;
            });
            upcomingAppointments.sort((a, b) => new Date(a.slotId.time).getTime() -
                new Date(b.slotId.time).getTime());
            return upcomingAppointments[0] || {};
        });
    }
    getUpcomingAppointmentByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const margin = 15 * 60 * 1000;
            const bookedSlots = yield this.bookedSlotRepository.findPendingAppointmentsByExpert(expertId);
            const upcomingAppointments = bookedSlots.filter((slot) => {
                if (!slot.slotId ||
                    typeof slot.slotId !== "object" ||
                    !("time" in slot.slotId) ||
                    !(typeof slot.slotId.time === "string" ||
                        typeof slot.slotId.time === "number" ||
                        slot.slotId.time instanceof Date)) {
                    console.error("Invalid slotId:", slot.slotId);
                    return false;
                }
                const slotTime = new Date(slot.slotId.time);
                return slotTime.getTime() > now.getTime() - margin;
            });
            upcomingAppointments.sort((a, b) => new Date(a.slotId.time).getTime() -
                new Date(b.slotId.time).getTime());
            return upcomingAppointments[0] || {};
        });
    }
    updateUpcomingSlot(appointmentId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.bookedSlotRepository.findSlotByIdAndUpdate(appointmentId, roomId);
            if (!data) {
                throw new Error("Appointment not found");
            }
            return data;
        });
    }
    updateSlotStatus(appointmentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.bookedSlotRepository.findSlotByIdAndUpdateStatus(appointmentId, status);
            if (!data) {
                throw new Error("Appointment not found");
            }
            return data;
        });
    }
}
exports.default = BookedSlotService;
