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
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    userAccessChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.query)
                const { userId, expertId } = req.query;
                // console.log("userId:", userId);
                // console.log("expertId:", expertId);
                const result = yield this.chatService.getUserChat(userId, expertId);
                if (typeof result === "string") {
                    res.status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST).json({ message: result });
                }
                else {
                    res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(result);
                }
            }
            catch (error) {
                console.error("Chat access error:", error);
                res.status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error",
                });
            }
        });
    }
    userFetchAllChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                // console.log("req.query.userId:", userId);
                if (!userId || typeof userId !== "string") {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Missing or invalid userId" });
                    return;
                }
                // Fetch chats via service
                const chats = yield this.chatService.fetchUserChats(userId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(chats);
            }
            catch (error) {
                console.error("Error in userFetchAllChat:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Server-side error" });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("sendMessage in serverSide");
                const { content, chatId, userId } = req.body;
                const message = yield this.chatService.sendMessage(content, chatId, userId);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json(message);
            }
            catch (error) {
                console.error("sendMessage error:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Server side error" });
            }
        });
    }
    userFetchAllMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("fetchAllMessages in serverSide");
                const { chatId } = req.query;
                if (!chatId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Chat ID is required" });
                    return;
                }
                const messages = yield this.chatService.fetchAllMessages(chatId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(messages);
            }
            catch (error) {
                console.error("fetchAllMessages error:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Server side error" });
            }
        });
    }
    getExpertChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expertId } = req.query;
                if (!expertId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Expert ID is required" });
                    return;
                }
                const chats = yield this.chatService.fetchChatsByExpert(expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(chats);
            }
            catch (error) {
                console.error("Error fetching expert chats:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    getExpertMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.query;
                if (!chatId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Chat ID is required" });
                    return;
                }
                const messages = yield this.chatService.fetchMessagesByChatId(chatId);
                res.status(httpStatusCodes_1.Http_Status_Codes.OK).json(messages);
            }
            catch (error) {
                console.error("Error fetching messages:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }
        });
    }
    expertSendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("expertSendMessage in serverSide");
                const { content, chatId, expertId } = req.body;
                if (!content || !chatId || !expertId) {
                    res
                        .status(httpStatusCodes_1.Http_Status_Codes.BAD_REQUEST)
                        .json({ message: "Invalid data passed" });
                    return;
                }
                const populatedMessage = yield this.chatService.sendExpertMessage(content, chatId, expertId);
                res.status(httpStatusCodes_1.Http_Status_Codes.CREATED).json(populatedMessage);
            }
            catch (error) {
                console.error("Error in expertSendMessage:", error);
                res
                    .status(httpStatusCodes_1.Http_Status_Codes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Server side error" });
            }
        });
    }
}
exports.default = ChatController;
