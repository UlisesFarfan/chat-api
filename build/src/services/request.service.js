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
exports.postRequest = void 0;
const requests_schema_1 = __importDefault(require("../models/requests.schema"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const postRequest = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRequest = new requests_schema_1.default(body);
        yield newRequest.save();
        yield user_schema_1.default.findByIdAndUpdate(body.transmitter, {
            $push: {
                messagesId: newRequest._id,
            }
        }, { new: true });
        yield user_schema_1.default.findByIdAndUpdate(body.receiver, {
            $push: {
                messagesId: newRequest._id,
            }
        }, { new: true });
    }
    catch (error) {
        throw error;
    }
});
exports.postRequest = postRequest;
