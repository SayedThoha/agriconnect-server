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
const expertModel_1 = require("../models/expertModel");
const userModel_1 = require("../models/userModel");
const findSenderModel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(id);
    if (user) {
        console.log("sender is from usercollection");
        return "User";
    }
    const expert = yield expertModel_1.Expert.findById(id);
    if (expert) {
        console.log("sender is from expertcollection");
        return "Expert";
    }
    return null;
});
exports.default = findSenderModel;
