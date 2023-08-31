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
exports.patchUserByIdController = exports.getUserByIdController = exports.getAllUsersController = exports.logoutUser = exports.getAuthUserController = void 0;
const user_schema_1 = __importDefault(require("../models/user.schema"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_service_1 = require("../services/user.service");
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logout(function (err) {
            if (err) {
                console.log(err);
            }
            return res.status(200).json({
                message: "Logout successful",
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.logoutUser = logoutUser;
const getAuthUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const valueBearer = (_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(" ").pop();
        const verifyAccess = (0, jwt_utils_1.verifyToken)(valueBearer);
        const user = yield user_schema_1.default.findOne({ email: verifyAccess === null || verifyAccess === void 0 ? void 0 : verifyAccess.email })
            .select("-hash -salt")
            .populate({
            path: "token",
            select: "access refresh",
        });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        const tokens = {
            access: (_d = user.token) === null || _d === void 0 ? void 0 : _d.access,
            refresh: (_e = user.token) === null || _e === void 0 ? void 0 : _e.refresh,
        };
        user.token = undefined;
        const userResponse = {
            user,
            access_token: tokens.access,
            refresh_token: tokens.refresh,
            token_type: "Bearer",
        };
        res.status(200).json(userResponse);
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.getAuthUserController = getAuthUserController;
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.find().populate({
            path: "chats",
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.getAllUsersController = getAllUsersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, user_service_1.getUserById)(id);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.getUserByIdController = getUserByIdController;
const patchUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body;
        const user = yield user_schema_1.default.findByIdAndUpdate(id, body);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.patchUserByIdController = patchUserByIdController;
