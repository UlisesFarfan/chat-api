"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    users: {
        type: [mongoose_1.Types.ObjectId],
        ref: "User",
    },
    lastMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: "Message"
    },
    messagesId: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Message",
    },
}, {
    versionKey: false,
    collection: "chats",
});
const ChatModel = (0, mongoose_1.model)("Chat", chatSchema, "chats");
ChatModel.syncIndexes();
exports.default = ChatModel;
