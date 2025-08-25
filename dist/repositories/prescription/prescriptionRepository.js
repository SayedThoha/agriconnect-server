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
const prescriptionModel_1 = require("../../models/prescriptionModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class PrescriptionRepository extends baseRepository_1.default {
    constructor() {
        super(prescriptionModel_1.Prescription);
    }
    findPrescriptionById(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prescriptionModel_1.Prescription.findById(prescriptionId).populate({
                path: "bookedSlot",
                populate: {
                    path: "expertId",
                    select: "firstName lastName specialisation",
                },
            });
        });
    }
    createPrescription(prescriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPrescription = new prescriptionModel_1.Prescription(prescriptionData);
            return yield newPrescription.save();
        });
    }
    updateBookedSlotWithPrescription(appointmentId, prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield bookeSlotModel_1.BookedSlot.findByIdAndUpdate(appointmentId, {
                $set: { prescription_id: prescriptionId },
            });
        });
    }
    findBookedSlotById(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bookeSlotModel_1.BookedSlot.findById(appointmentId);
        });
    }
    findPrescriptionsById(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prescriptionModel_1.Prescription.findById(prescriptionId);
        });
    }
    getPrescriptionsByExpert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prescriptions = yield prescriptionModel_1.Prescription.find()
                    .populate({
                    path: "bookedSlot",
                    populate: {
                        path: "userId",
                        select: "firstName lastName email",
                    },
                })
                    .populate({
                    path: "bookedSlot",
                    populate: {
                        path: "expertId",
                        select: "firstName lastName",
                    },
                });
                return prescriptions;
            }
            catch (error) {
                console.error(error);
                throw new Error("Error fetching prescriptions");
            }
        });
    }
}
exports.default = PrescriptionRepository;
