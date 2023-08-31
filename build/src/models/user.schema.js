"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    contacts: {
        type: [mongoose_1.Types.ObjectId],
        ref: "User",
    },
    blocked: {
        type: [mongoose_1.Types.ObjectId],
        ref: "User",
    },
    chats: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Chat"
    },
    archive_chats: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Chat"
    },
    requests: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Request",
    },
    tag: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        default: "Hey there! I am using Chat App"
    },
    notifications: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Notification",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    hash: {
        type: String,
    },
    delete_at: {
        type: Date || null,
        default: null,
    },
    token: {
        type: mongoose_1.Types.ObjectId,
        ref: "Tokens",
    },
}, {
    versionKey: false,
    collection: "users",
});
const UserModel = (0, mongoose_1.model)("User", userSchema, "users");
UserModel.syncIndexes();
exports.default = UserModel;
