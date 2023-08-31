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
exports.deleteMessageByIdController = exports.newMessageController = void 0;
const message_service_1 = require("../services/message.service");
const newMessageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield (0, message_service_1.newMessage)(req.body);
        res.status(201).json({
            message,
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.newMessageController = newMessageController;
const deleteMessageByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, message_service_1.deleteMessageById)(id);
        res.status(201).json({
            message: "delete successfully"
        });
    }
    catch (error) {
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
});
exports.deleteMessageByIdController = deleteMessageByIdController;
