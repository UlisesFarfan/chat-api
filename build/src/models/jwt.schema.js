"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jwtSchema = new mongoose_1.Schema({
    access: {
        type: String,
        required: true,
    },
    refresh: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
});
const JwtModel = (0, mongoose_1.model)("Tokens", jwtSchema);
JwtModel.syncIndexes();
exports.default = JwtModel;
