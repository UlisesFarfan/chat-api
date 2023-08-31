"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    chatId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    _delete: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    }
}, {
    versionKey: false,
    collection: "messages",
});
const MessageModel = (0, mongoose_1.model)("Message", messageSchema, "messages");
MessageModel.syncIndexes();
exports.default = MessageModel;
