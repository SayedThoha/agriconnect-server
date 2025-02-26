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
class PrescriptionService {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    getPrescriptionDetails(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.prescriptionRepository.findPrescriptionById(prescriptionId);
            if (!data) {
                throw new Error("Prescription not found");
            }
            return data;
        });
    }
    //expert
    addPrescription(appointmentId, issue, prescription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appointmentId || !issue || !prescription) {
                throw new Error("Missing required fields");
            }
            try {
                const bookedSlot = yield this.prescriptionRepository.findBookedSlotById(appointmentId);
                if (!bookedSlot) {
                    throw new Error("Appointment not found");
                }
                const newPrescription = yield this.prescriptionRepository.createPrescription({
                    bookedSlot: appointmentId,
                    issue,
                    prescription,
                });
                yield this.prescriptionRepository.updateBookedSlotWithPrescription(appointmentId, newPrescription._id);
                return newPrescription;
            }
            catch (error) {
                console.error("Error adding prescription:", error);
                throw new Error("Failed to add prescription");
            }
        });
    }
    getPrescriptionDetailsByExpert(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.prescriptionRepository.findPrescriptionsById(prescriptionId);
            if (!data) {
                throw new Error("Prescription not found");
            }
            return data;
        });
    }
    getAllPrescriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prescriptionRepository.getPrescriptionsByExpert();
            }
            catch (error) {
                console.log(error);
                throw new Error("Prescriptions not found");
            }
        });
    }
}
exports.default = PrescriptionService;
