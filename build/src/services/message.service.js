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
exports.deleteMessageById = exports.newMessage = void 0;
const message_schema_1 = __importDefault(require("../models/message.schema"));
const chat_schema_1 = __importDefault(require("../models/chat.schema"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const newMessage = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        body.date = new Date();
        const newMessage = new message_schema_1.default(body);
        yield newMessage.save();
        const addMessageToChat = yield chat_schema_1.default.findByIdAndUpdate(body.chatId, {
            $push: {
                messagesId: newMessage._id,
            },
            lastMessage: newMessage._id
        }, { new: true });
        if (addMessageToChat) {
            yield addMessageToChat.save();
            for (let i = 0; i < addMessageToChat.users.length; i++) {
                const userChat = yield user_schema_1.default.find({
                    _id: addMessageToChat.users[i],
                    chats: [addMessageToChat._id]
                });
                const userArchive = yield user_schema_1.default.find({
                    _id: addMessageToChat.users[i],
                    archive_chats: [addMessageToChat._id]
                });
                if (userChat.length === 0 && userArchive.length === 0) {
                    yield user_schema_1.default.findByIdAndUpdate(addMessageToChat.users[i], {
                        $addToSet: { chats: addMessageToChat._id }
                    });
                }
            }
        }
        return newMessage;
    }
    catch (error) {
        throw error;
    }
});
exports.newMessage = newMessage;
const deleteMessageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(id);
        const a = yield message_schema_1.default.findByIdAndUpdate(id, {
            _delete: true
        });
        return "delete successfully";
    }
    catch (error) {
        throw error;
    }
});
exports.deleteMessageById = deleteMessageById;
