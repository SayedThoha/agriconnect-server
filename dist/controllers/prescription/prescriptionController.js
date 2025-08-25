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
class PrescriptionController {
    constructor(prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    getPrescriptionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required data" });
                    return;
                }
                const data = yield this.prescriptionService.getPrescriptionDetails(_id);
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
    addPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId, issue, prescription } = req.query;
                if (!appointmentId || !issue || !prescription) {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({
                        message: "Missing required fields",
                    });
                    return;
                }
                const newPrescription = yield this.prescriptionService.addPrescription(appointmentId.toString(), issue.toString(), prescription.toString());
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json({
                    message: "Prescription added",
                    prescription: newPrescription,
                });
            }
            catch (error) {
                console.error("Error in addPrescription:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: error instanceof Error ? error.message : "Internal Server Error",
                });
            }
        });
    }
    getPrescriptionDetailsByExpert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                if (!_id) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing required data" });
                    return;
                }
                const data = yield this.prescriptionService.getPrescriptionDetailsByExpert(_id);
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
    getAllPrescriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prescriptions = yield this.prescriptionService.getAllPrescriptions();
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(prescriptions);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "internal server Error" });
            }
        });
    }
}
exports.default = PrescriptionController;
