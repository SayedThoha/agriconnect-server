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
const adminModel_1 = require("../../models/adminModel");
const expertModel_1 = require("../../models/expertModel");
const userModel_1 = require("../../models/userModel");
class AdminRepository {
    constructor() { }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield adminModel_1.Admin.findOne({ email });
        });
    }
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.User.countDocuments({});
        });
    }
    getExpertCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertModel_1.Expert.countDocuments({});
        });
    }
}
exports.default = AdminRepository;
