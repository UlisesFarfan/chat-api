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
exports.deletUserArchiveChat = exports.deletUserChat = exports.putArchiveChat = exports.getChatsUserByUsersName = exports.deleteChatById = exports.getChatsUserByName = exports.getChatsUserById = exports.getChatById = exports.getAllChats = exports.newChat = void 0;
const chat_schema_1 = __importDefault(require("../models/chat.schema"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const message_service_1 = require("./message.service");
const mongoose_1 = __importDefault(require("mongoose"));
const newChat = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat, message } = body;
    try {
        let isBlock = false;
        if (!chat || !message)
            throw new Error("1");
        const existChat = yield chat_schema_1.default.find({
            users: chat.users
        });
        for (let i = 0; i < chat.users.length; i++) {
            const user = yield user_schema_1.default.findById(chat.users[i]);
            user === null || user === void 0 ? void 0 : user.blocked.map((el) => {
                if (el.toString() === chat.users[0] || el.toString() === chat.users[1])
                    isBlock = true;
            });
        }
        if (!existChat[0] && isBlock) {
            throw new Error("2");
        }
        if (existChat[0]) {
            message.chatId = existChat[0]._id;
        }
        else {
            const newChat = yield new chat_schema_1.default(chat);
            yield newChat.save();
            message.chatId = newChat._id;
        }
        yield (0, message_service_1.newMessage)(message);
        chat.users.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_schema_1.default.findByIdAndUpdate(id, {
                $addToSet: { chats: message.chatId }
            });
        }));
        const Res = yield chat_schema_1.default.findById(message.chatId)
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        return Res;
    }
    catch (error) {
        throw error;
    }
});
exports.newChat = newChat;
const getAllChats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chat_schema_1.default.find()
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        return chats;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllChats = getAllChats;
const getChatById = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_schema_1.default.findByIdAndUpdate(chatId, {
            messageToView: false
        })
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        return chat;
    }
    catch (error) {
        throw error;
    }
});
exports.getChatById = getChatById;
const getChatsUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chat_schema_1.default.find({ users: userId })
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        const user = yield user_schema_1.default.findById(userId);
        let chatsUnarchive = [];
        if (chats === null || user === null)
            return "Invalid Data.";
        for (let i = 0; i < user.chats.length; i++) {
            chats.forEach(el => {
                if (el._id.toString() === user.chats[i].toString()) {
                    chatsUnarchive.push(el);
                }
            });
        }
        ;
        const chatsArchive = [];
        for (let i = 0; i < user.archive_chats.length; i++) {
            for (let j = 0; j < chats.length; j++) {
                if (chats[j]._id.toString() == user.archive_chats[i].toString()) {
                    chatsArchive.push(chats[j]);
                }
            }
        }
        return { chatsUnarchive, chatsArchive };
    }
    catch (error) {
        throw error;
    }
});
exports.getChatsUserById = getChatsUserById;
const putArchiveChat = (userId, chatId, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (action == "archive") {
            yield user_schema_1.default.findByIdAndUpdate(userId, {
                $pull: { chats: chatId }
            });
            yield user_schema_1.default.findByIdAndUpdate(userId, {
                $addToSet: { archive_chats: chatId }
            });
            return "Archive Successfully.";
        }
        if (action == "unarchive") {
            yield user_schema_1.default.findByIdAndUpdate(userId, {
                $pull: { archive_chats: chatId }
            });
            yield user_schema_1.default.findByIdAndUpdate(userId, {
                $addToSet: { chats: chatId }
            });
            return "Unarchive Successfully.";
        }
    }
    catch (error) {
        throw error;
    }
});
exports.putArchiveChat = putArchiveChat;
const deletUserChat = (userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_schema_1.default.findByIdAndUpdate(userId, {
            $pull: { chats: chatId }
        });
        let chat = yield chat_schema_1.default.findById(chatId);
        if (chat === null)
            return "Chat not exist.";
        let deletePermanentrly = true;
        for (let i = 0; i < chat.users.length; i++) {
            const user = yield user_schema_1.default.findById(chat.users[i]);
            user === null || user === void 0 ? void 0 : user.chats.forEach(e => {
                if (e.toString() == chatId)
                    deletePermanentrly = false;
            });
            user === null || user === void 0 ? void 0 : user.archive_chats.forEach(e => {
                if (e.toString() == chatId)
                    deletePermanentrly = false;
            });
        }
        if (deletePermanentrly)
            yield chat_schema_1.default.findByIdAndDelete(chatId);
        return "Delete Successfully.";
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.deletUserChat = deletUserChat;
const deletUserArchiveChat = (userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, chatId);
    try {
        yield user_schema_1.default.findByIdAndUpdate(userId, {
            $pull: { archive_chats: chatId }
        });
        let chat = yield chat_schema_1.default.findById(chatId);
        if (chat === null)
            return "Chat not exist.";
        let deletePermanentrly = true;
        for (let i = 0; i < chat.users.length; i++) {
            const user = yield user_schema_1.default.findById(chat.users[i]);
            user === null || user === void 0 ? void 0 : user.chats.forEach(e => {
                if (e.toString() == chatId)
                    deletePermanentrly = false;
            });
            user === null || user === void 0 ? void 0 : user.archive_chats.forEach(e => {
                if (e.toString() == chatId)
                    deletePermanentrly = false;
            });
        }
        if (deletePermanentrly)
            yield chat_schema_1.default.findByIdAndDelete(chatId);
        return "Delete Successfully.";
    }
    catch (error) {
        throw error;
    }
});
exports.deletUserArchiveChat = deletUserArchiveChat;
const getChatsUserByUsersName = (userId, secUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUserId = new mongoose_1.default.Types.ObjectId(userId);
        const newSecUserId = new mongoose_1.default.Types.ObjectId(secUserId);
        const chats = yield chat_schema_1.default.find({
            users: {
                $all: [newUserId, newSecUserId]
            }
        })
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        return chats[0];
    }
    catch (error) {
        throw error;
    }
});
exports.getChatsUserByUsersName = getChatsUserByUsersName;
const getChatsUserByName = (userId, userName, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findById(userId);
        let chats = yield chat_schema_1.default.find({ users: userId })
            .populate({ path: "messagesId" })
            .populate({ path: "users", select: "name tag" })
            .populate({ path: "lastMessage" });
        if (chats === null || user === null || !type)
            return "Invalid Data.";
        let newChats = [];
        let filterArchiveChat = [];
        let filterUnarchiveChat = [];
        for (let i = 0; i < chats.length; i++) {
            chats[i].users.forEach((el) => {
                if (el.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase()) && el._id.toString() !== userId) {
                    newChats.push(chats[i]);
                }
            });
        }
        ;
        if (type === "unarchive") {
            for (let i = 0; i < user.chats.length; i++) {
                newChats.forEach((el) => {
                    if (el._id.toString() === user.chats[i].toString()) {
                        filterUnarchiveChat.push(el);
                    }
                });
            }
            ;
        }
        if (type === "archive") {
            for (let i = 0; i < user.archive_chats.length; i++) {
                newChats.forEach((el) => {
                    if (el._id.toString() === user.archive_chats[i].toString()) {
                        filterArchiveChat.push(el);
                    }
                });
            }
            ;
        }
        return {
            filterUnarchiveChat,
            filterArchiveChat
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getChatsUserByName = getChatsUserByName;
const deleteChatById = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chat_schema_1.default.findByIdAndDelete(chatId);
        return "Chat deleted successfully";
    }
    catch (error) {
        throw error;
    }
});
exports.deleteChatById = deleteChatById;
