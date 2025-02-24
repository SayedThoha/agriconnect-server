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
const adminModel_1 = require("../../models/adminModel");
const expertModel_1 = require("../../models/expertModel");
const slotModel_1 = require("../../models/slotModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
class SlotRepository extends baseRepository_1.default {
    constructor() {
        super(slotModel_1.Slot);
    }
    findSlotByExpertIdAndTime(expertId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield slotModel_1.Slot.findOne({ expertId, time });
            }
            catch (error) {
                throw new Error(`Error finding slot: ${error}`);
            }
        });
    }
    createSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield slotModel_1.Slot.create(slotData);
                return yield slot.save();
            }
            catch (error) {
                throw new Error(`Error creating slot: ${error}`);
            }
        });
    }
    findAdminSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield adminModel_1.Admin.find({});
            }
            catch (error) {
                throw new Error(`Error finding admin settings: ${error}`);
            }
        });
    }
    findExpertById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield expertModel_1.Expert.findById(id);
            }
            catch (error) {
                console.error("Error in expert repository findById:", error);
                throw new Error("Database operation failed");
            }
        });
    }
    createMultipleSlots(slots) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.insertMany(slots);
        });
    }
    findSlotsByExpertId(expertId, currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield slotModel_1.Slot.find({
                    expertId: expertId,
                    time: { $gte: currentTime },
                }).sort({ time: 1 });
            }
            catch (error) {
                throw new Error(`Error fetching slots for expert ${expertId}: ${error}`);
            }
        });
    }
    findSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.findById(slotId);
        });
    }
    deleteSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield slotModel_1.Slot.findByIdAndDelete(slotId);
        });
    }
}
exports.default = SlotRepository;
