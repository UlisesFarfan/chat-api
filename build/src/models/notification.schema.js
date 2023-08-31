"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
}, {
    versionKey: false,
    collection: "notification",
});
const NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema, "notification");
NotificationModel.syncIndexes();
exports.default = NotificationModel;
