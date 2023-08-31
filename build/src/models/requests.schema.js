"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const requests_interface_1 = require("../interfaces/requests.interface");
const requestSchema = new mongoose_1.Schema({
    receiver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    transmitter: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: [
            requests_interface_1.TypeStatus.PENDING,
            requests_interface_1.TypeStatus.REJECTED,
            requests_interface_1.TypeStatus.ACEPTED,
        ],
        default: requests_interface_1.TypeStatus.PENDING
    },
    viewed: {
        type: Boolean,
        require: true,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    }
}, {
    versionKey: false,
    collection: "requests",
});
const RequestModel = (0, mongoose_1.model)("Request", requestSchema, "requests");
RequestModel.syncIndexes();
exports.default = RequestModel;
