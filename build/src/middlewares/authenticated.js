"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token) {
        res.status(401).send({ message: "Unauthorized" });
    }
    else {
        token = token.replace('Bearer ', '');
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
            req.user = decode;
            next();
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
};
exports.validateToken = validateToken;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};
exports.isAuthenticated = isAuthenticated;
