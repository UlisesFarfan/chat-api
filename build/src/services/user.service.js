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
exports.deleteAccountUser = exports.deleteContact = exports.putBlockUser = exports.upDateInfo = exports.getContactBlocked = exports.getContactsByName = exports.getContactByUserId = exports.getUserById = exports.removeChat = exports.addContact = exports.extractUser = exports.deleteUserById = exports.serviceCreateUser = exports.register = void 0;
const user_schema_1 = __importDefault(require("../models/user.schema"));
const jwt_utils_1 = require("../utils/jwt.utils");
const password_utils_1 = require("../utils/password.utils");
;
const serviceCreateUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, tag } = body;
    const userData = {
        email,
        name,
        password,
        tag
    };
    try {
        let { user } = yield (0, exports.register)(userData);
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.serviceCreateUser = serviceCreateUser;
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash, salt } = (0, password_utils_1.hashPassword)(user.password);
        user.hash = hash;
        user.salt = salt;
        delete user.password;
        let newUser = new user_schema_1.default(user);
        yield newUser.save();
        newUser = Object.fromEntries(Object.entries(newUser.toObject()).filter(([key]) => !key.includes.hash && !key.includes.salt));
        return {
            user: newUser,
            message: "User created successfully",
        };
    }
    catch (error) {
        throw error;
    }
});
exports.register = register;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_schema_1.default.findByIdAndDelete(id);
        return "User deleted successfully";
    }
    catch (error) {
        throw error;
    }
});
exports.deleteUserById = deleteUserById;
const extractUser = (headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = headers;
        let [type, value] = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ");
        if (type !== "Bearer") {
            throw new Error("Invalid token");
        }
        const { email } = (0, jwt_utils_1.verifyRefreshToken)(value);
        const user = user_schema_1.default.findOne({ email });
        return user._id;
    }
    catch (error) {
        throw error;
    }
});
exports.extractUser = extractUser;
const addContact = (userId, userTag) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContact = yield user_schema_1.default.find({
            tag: userTag
        });
        if (newContact[0]._id.toString() === userId)
            throw new Error("User invalid.");
        if (newContact.length === 0)
            throw new Error("User not found.");
        const user = yield user_schema_1.default.findByIdAndUpdate(userId, {
            $addToSet: {
                contacts: newContact[0]._id
            },
            $pull: {
                blocked: newContact[0]._id
            },
        }, { new: true }).populate({ path: "contacts blocked", select: "name description" });
        if (!user)
            throw Error("Invalid data.");
        return {
            block_users: user.blocked,
            friends: user.contacts
        };
    }
    catch (error) {
        throw error;
    }
});
exports.addContact = addContact;
const deleteContact = (userId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findByIdAndUpdate(userId, {
            $pull: {
                contacts: contactId
            }
        }, { new: true }).populate({ path: "contacts", select: "name description" });
        if (!user)
            throw new Error("Invalid data.");
        return user.contacts;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.deleteContact = deleteContact;
const removeChat = (userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        user_schema_1.default.updateOne({ _id: userId }, { $pull: { chat: chatId } });
        return "Contact removed Successfully";
    }
    catch (error) {
        throw error;
    }
});
exports.removeChat = removeChat;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findById(id);
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserById = getUserById;
const getContactsByName = (userId, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_schema_1.default.findById(userId, {
            contacts: 1
        })
            .populate({ path: "contacts", select: "name description" });
        const result = [];
        if (user) {
            user.contacts.forEach((el) => {
                if (el.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase())) {
                    result.push(el);
                }
            });
        }
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.getContactsByName = getContactsByName;
const getContactByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findById(userId).populate({ path: "contacts", select: "name description" });
        return user === null || user === void 0 ? void 0 : user.contacts;
    }
    catch (error) {
        throw error;
    }
});
exports.getContactByUserId = getContactByUserId;
const getContactBlocked = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findById(id, {
            blocked: 1,
            _id: 0
        })
            .populate({ path: "blocked", select: "name description" });
        if (!user)
            throw Error("Invalid data.");
        return user.blocked;
    }
    catch (error) {
        throw error;
    }
    ;
});
exports.getContactBlocked = getContactBlocked;
const putBlockUser = (id, otherUser, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blocked;
        let contacts;
        if (action === "block") {
            const user = yield user_schema_1.default.findByIdAndUpdate(id, {
                $pull: {
                    contacts: otherUser
                },
                $addToSet: {
                    blocked: otherUser
                }
            }, {
                new: true
            }).populate({ path: "contacts blocked", select: "name description" });
            if (!user)
                throw Error("Invalid data.");
            blocked = user.blocked;
            contacts = user.contacts;
        }
        ;
        if (action === "unblock") {
            const user = yield user_schema_1.default.findByIdAndUpdate(id, {
                $pull: {
                    blocked: otherUser
                }
            }, {
                new: true
            }).populate({ path: "contacts blocked", select: "name description" });
            if (!user)
                throw Error("Invalid data.");
            blocked = user.blocked;
            contacts = user.contacts;
        }
        ;
        return {
            block_users: blocked,
            friends: contacts
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    ;
});
exports.putBlockUser = putBlockUser;
const upDateInfo = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, tag, userId } = body;
    try {
        const upDateUser = yield user_schema_1.default.findByIdAndUpdate(userId, {
            name: name,
            description: description,
            tag: tag,
        }, { new: true });
        if (!upDateUser)
            throw new Error("Invalid user.");
        const user = {
            _id: upDateUser._id,
            name: upDateUser.name,
            tag: upDateUser.tag,
            description: upDateUser.description,
            email: upDateUser.email
        };
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    ;
});
exports.upDateInfo = upDateInfo;
const deleteAccountUser = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findByIdAndUpdate(userId, {
            name: "User deleted.",
            contacts: [],
            blocked: [],
            chats: [],
            archive_chats: [],
            requests: [],
            tag: email + "delete account.",
            description: "",
            notifications: [],
            email: email + "delete account.",
            delete_at: new Date(),
        }, {
            new: true
        });
        return "Account deleted successfully.";
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    ;
});
exports.deleteAccountUser = deleteAccountUser;
