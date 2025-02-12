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
const messageModel_1 = require("../../models/messageModel");
class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    getUserChat(userId, expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const chat = yield this.chatRepository.findChatByUserId(userId);
            if (chat) {
                return chat;
            }
            else {
                if (!expertId) {
                    throw new Error("You don't have any chats yet");
                }
                return yield this.chatRepository.createChat(userId, expertId);
            }
        });
    }
    fetchUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all chats from the repository
            const chats = yield this.chatRepository.findChatsByUserId(userId);
            // Ensure latestMessage is populated
            for (const chat of chats) {
                if (chat.latestMessage) {
                    const populatedMessage = yield messageModel_1.Message.findById(chat.latestMessage).populate("sender");
                    if (populatedMessage) {
                        chat.latestMessage = populatedMessage;
                    }
                }
            }
            return chats;
        });
    }
    sendMessage(content, chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content || !chatId || !userId) {
                throw new Error("Invalid data passed as content, chatId, or userId");
            }
            // Create the new message
            const newMessage = yield messageModel_1.Message.create({
                sender: userId,
                senderModel: "User",
                content,
                chat: chatId,
            });
            if (!newMessage) {
                throw new Error("Message creation failed");
            }
            // Use repository to update the latest message in the chat
            yield this.chatRepository.updateLatestMessage(chatId, newMessage._id.toString());
            // Populate sender field in the message response
            return messageModel_1.Message.findById(newMessage._id).populate({
                path: "sender",
                model: "User",
            });
        });
    }
    fetchAllMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId) {
                throw new Error("Chat ID is required");
            }
            return this.chatRepository.findMessagesByChatId(chatId);
        });
    }
    fetchChatsByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expertId) {
                throw new Error("Expert ID is required");
            }
            return this.chatRepository.findChatsByExpertId(expertId);
        });
    }
    fetchMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId) {
                throw new Error("Chat ID is required");
            }
            return this.chatRepository.findMessagesByChatId(chatId);
        });
    }
    sendExpertMessage(content, chatId, expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content || !chatId || !expertId) {
                throw new Error("Invalid data: Content, Chat ID, and Expert ID are required.");
            }
            return this.chatRepository.createMessage(content, chatId, expertId, "Expert");
        });
    }
}
exports.default = ChatService;
