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
exports.deletUserArchiveChatByIdController = exports.deleteUserChatByIdController = exports.putArchiveChatController = exports.getChatsUserByUsersNameController = exports.deleteChatByIdController = exports.getChatsUserByNameController = exports.getChatsUserByIdController = exports.getChatByIdController = exports.getAllChatsController = exports.createChat = void 0;
const chat_service_1 = require("../services/chat.service");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield (0, chat_service_1.newChat)(req.body);
        res.status(200).json(chat);
    }
    catch (error) {
        if (error.message.includes("1")) {
            res.status(403).json({
                message: "Invalid data."
            });
        }
        if (error.message.includes("2")) {
            res.status(400).json({
                message: "This user has blocked you."
            });
        }
    }
    ;
});
exports.createChat = createChat;
const getAllChatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield (0, chat_service_1.getAllChats)();
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.getAllChatsController = getAllChatsController;
const getChatByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const chat = yield (0, chat_service_1.getChatById)(id);
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.getChatByIdController = getChatByIdController;
const getChatsUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const chats = yield (0, chat_service_1.getChatsUserById)(userId);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.getChatsUserByIdController = getChatsUserByIdController;
const getChatsUserByUsersNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, secUserId } = req.query;
        if (typeof userId !== "string" || typeof secUserId !== "string")
            throw { message: "invalid data" };
        const chats = yield (0, chat_service_1.getChatsUserByUsersName)(userId, secUserId);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.getChatsUserByUsersNameController = getChatsUserByUsersNameController;
const putArchiveChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, userId, action } = req.query;
        if (typeof userId !== "string" || typeof chatId !== "string" || typeof action !== "string")
            throw { message: "invalid data" };
        const chats = yield (0, chat_service_1.putArchiveChat)(userId, chatId, action);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.putArchiveChatController = putArchiveChatController;
const getChatsUserByNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { userName, type } = req.query;
        const userNameSearch = typeof userName === "string" ? userName : "";
        if (typeof type !== "string")
            return "Invalid Data.";
        const chats = yield (0, chat_service_1.getChatsUserByName)(userId, userNameSearch, type);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.getChatsUserByNameController = getChatsUserByNameController;
const deleteChatByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.query;
        if (typeof (chatId) !== "string")
            throw { message: "Invalid data" };
        const chats = yield (0, chat_service_1.deleteChatById)(chatId);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.deleteChatByIdController = deleteChatByIdController;
const deleteUserChatByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chatId } = req.query;
        if (typeof (userId) !== "string" || typeof (chatId) !== "string")
            throw { message: "Invalid data" };
        const chats = yield (0, chat_service_1.deletUserChat)(userId, chatId);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.deleteUserChatByIdController = deleteUserChatByIdController;
const deletUserArchiveChatByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chatId } = req.query;
        if (typeof (userId) !== "string" || typeof (chatId) !== "string")
            throw { message: "Invalid data" };
        const chats = yield (0, chat_service_1.deletUserArchiveChat)(userId, chatId);
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json(error);
    }
    ;
});
exports.deletUserArchiveChatByIdController = deletUserArchiveChatByIdController;
