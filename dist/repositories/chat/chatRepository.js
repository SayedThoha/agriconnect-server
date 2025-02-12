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
const chatModel_1 = require("../../models/chatModel");
const messageModel_1 = require("../../models/messageModel");
const baseRepository_1 = __importDefault(require("../base/baseRepository"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository extends baseRepository_1.default {
    constructor() {
        super(chatModel_1.Chat);
    }
    findChatByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ user: userId }).populate([
                { path: "user", model: "User" },
                { path: "expert", model: "Expert" },
                { path: "latestMessage", populate: { path: "sender" } },
            ]);
        });
    }
    createChat(userId, expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatData = {
                chatName: "sender",
                user: new mongoose_1.default.Types.ObjectId(userId), // Convert to ObjectId
                expert: new mongoose_1.default.Types.ObjectId(expertId), // Convert to ObjectId
            };
            const createdChat = yield this.create(chatData); // Use BaseRepository create method
            return this.model
                .findOne({ _id: createdChat._id })
                .populate({ path: "user", model: "User" })
                .populate({ path: "expert", model: "Expert" });
        });
    }
    findChatsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .find({ users: userId }) // Ensure userId is an ObjectId
                .populate([
                { path: "user", model: "User" },
                { path: "expert", model: "Expert" },
                { path: "latestMessage", model: "Message" },
            ])
                .sort({ updatedAt: -1 });
        });
    }
    updateLatestMessage(chatId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(chatId, { $set: { latestMessage: messageId } }, { new: true });
        });
    }
    findMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield messageModel_1.Message.find({ chat: chatId }).sort({ updatedAt: -1 });
        });
    }
    findChatsByExpertId(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .find({ expert: expertId })
                .populate([
                { path: "user", model: "User" },
                { path: "expert", model: "Expert" },
                { path: "latestMessage", model: "Message" },
            ])
                .sort({ updatedAt: -1 });
        });
    }
    // async findMessagesByChatId(chatId: string): Promise<IMessage[]> {
    //   return await Message.find({ chat: chatId }).sort({ updatedAt: -1 });
    // }
    createMessage(content, chatId, senderId, senderModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = yield messageModel_1.Message.create({
                sender: senderId,
                senderModel,
                content,
                chat: chatId,
            });
            // Update chat with the latest message
            yield this.model.findByIdAndUpdate(chatId, {
                $set: { latestMessage: newMessage._id },
            });
            // Populate sender before returning
            return yield messageModel_1.Message.findById(newMessage._id).populate({
                path: "sender",
                model: senderModel,
            });
        });
    }
}
exports.default = ChatRepository;
