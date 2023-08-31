"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = exports.verifyToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (authCode) => {
    return (0, jsonwebtoken_1.verify)(authCode, process.env.SECRET_JWT, (error, decoded) => {
        if (error) {
            throw error;
        }
        return {
            email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
        };
    });
};
exports.verifyToken = verifyToken;
const generateAccessToken = (payload) => {
    let secret = process.env.SECRET_JWT;
    let expire = process.env.JWT_EXPIRATION;
    const accessToken = (0, jsonwebtoken_1.sign)({ payload }, secret, {
        expiresIn: expire,
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const refreshToken = (0, jsonwebtoken_1.sign)({ payload }, process.env.SECRET_REFRESH, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (payload) => {
    return (0, jsonwebtoken_1.verify)(payload, process.env.SECRET_REFRESH, (error, decoded) => {
        if (error) {
            throw error;
        }
        return decoded;
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
