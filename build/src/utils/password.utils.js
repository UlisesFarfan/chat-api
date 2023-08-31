"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const crypto_2 = require("crypto");
const hashPassword = (password, salt) => {
    salt = salt ? salt : crypto_1.default.randomBytes(16).toString("base64");
    const encrypt = (0, crypto_2.scryptSync)(password, salt, 64);
    return { hash: encrypt.toString("base64"), salt: salt };
};
exports.hashPassword = hashPassword;
