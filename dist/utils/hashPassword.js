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
exports.comparePass = exports.hashedPass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashedPass = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("password hashing")
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        console.error('Password hashing error:', error);
        throw new Error('Failed to hash password');
    }
});
exports.hashedPass = hashedPass;
const comparePass = (password, hashedPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(password, hashedPass);
    }
    catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password comparison failed.");
    }
});
exports.comparePass = comparePass;
