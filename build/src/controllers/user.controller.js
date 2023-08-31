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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountUserController = exports.deleteContactController = exports.putBlockUserController = exports.upDateInfoController = exports.getContactBlockedController = exports.getContactByContactNameController = exports.getContactByUserIdController = exports.addContactController = exports.deleteUserController = exports.createUser = void 0;
const user_service_1 = require("../services/user.service");
const createUser = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let messageCreate = yield (0, user_service_1.serviceCreateUser)(body);
        messageCreate.password = body.password;
        res.status(201).json({
            message: messageCreate,
        });
    }
    catch (error) {
        if (!error.status) {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(error.status).json({
            keys: error.keys ? error.keys : undefined,
            message: error.message,
        });
    }
});
exports.createUser = createUser;
const deleteUserController = ({ params }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageDelete = yield (0, user_service_1.deleteUserById)(params.id);
        res.status(201).json({
            message: messageDelete,
        });
    }
    catch (error) {
        if (!error.status) {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(error.status).json({
            keys: error.keys ? error.keys : undefined,
            message: error.message,
        });
    }
    ;
});
exports.deleteUserController = deleteUserController;
const addContactController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userTag } = req.body;
        console.log(userId, userTag);
        if (typeof userId !== "string" || typeof userTag !== "string")
            return "Invalid Data.";
        const addContactMessage = yield (0, user_service_1.addContact)(userId, userTag);
        res.status(200).json(addContactMessage);
    }
    catch (error) {
        res.status(404).json({
            message: "User not found."
        });
    }
    ;
});
exports.addContactController = addContactController;
const getContactByUserIdController = ({ params }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = params;
        const contacts = yield (0, user_service_1.getContactByUserId)(id);
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(400).json({
            message: "Failure To Get Contacts"
        });
    }
    ;
});
exports.getContactByUserIdController = getContactByUserIdController;
const getContactByContactNameController = ({ query, params }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = query;
        const { id } = params;
        if (typeof id !== "string" || typeof userName !== "string")
            throw { message: "invalid data" };
        const contacts = yield (0, user_service_1.getContactsByName)(id, userName);
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(error.status).json({
            message: "Failure To Get Contacts"
        });
    }
    ;
});
exports.getContactByContactNameController = getContactByContactNameController;
const getContactBlockedController = ({ query, params }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = params;
        const usersNumber = yield (0, user_service_1.getContactBlocked)(id);
        res.status(200).json(usersNumber);
    }
    catch (error) {
        res.status(error.status).json({
            message: "Failure To Get Contacts"
        });
    }
});
exports.getContactBlockedController = getContactBlockedController;
const upDateInfoController = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersNumber = yield (0, user_service_1.upDateInfo)(body);
        res.status(200).json(usersNumber);
    }
    catch (error) {
        res.status(error.status).json({
            message: "Failure To Get Contacts"
        });
    }
});
exports.upDateInfoController = upDateInfoController;
const putBlockUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, otherUser, action } = req.query;
        if (typeof (id) !== "string" || typeof (otherUser) !== "string" || typeof (action) !== "string")
            throw { message: "Invalid data" };
        const usersNumber = yield (0, user_service_1.putBlockUser)(id, otherUser, action);
        res.status(200).json(usersNumber);
    }
    catch (error) {
        res.status(error.status).json({
            message: "Failure To Get Contacts"
        });
    }
});
exports.putBlockUserController = putBlockUserController;
const deleteContactController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, otherUser } = req.query;
        if (typeof (id) !== "string" || typeof (otherUser) !== "string")
            throw { message: "Invalid data" };
        const usersNumber = yield (0, user_service_1.deleteContact)(id, otherUser);
        res.status(200).json(usersNumber);
    }
    catch (error) {
        res.status(error.status).json({
            message: "Failure To Get Contacts"
        });
    }
});
exports.deleteContactController = deleteContactController;
const deleteAccountUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email } = req.query;
        if (typeof (email) !== "string")
            throw { message: "Invalid data" };
        const usersNumber = yield (0, user_service_1.deleteAccountUser)(id, email);
        res.status(200).json(usersNumber);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});
exports.deleteAccountUserController = deleteAccountUserController;
