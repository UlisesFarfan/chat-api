"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.server = exports.passport = void 0;
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const oauth2orize_1 = __importStar(require("oauth2orize"));
const passport_local_1 = require("passport-local");
const passport_oauth2_client_password_1 = require("passport-oauth2-client-password");
const user_schema_1 = __importDefault(require("../models/user.schema"));
const password_utils_1 = require("../utils/password.utils");
const jwt_schema_1 = __importDefault(require("../models/jwt.schema"));
const jwt_utils_1 = require("../utils/jwt.utils");
const server = oauth2orize_1.default.createServer();
exports.server = server;
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    user_schema_1.default.findById(id)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => {
        done(err, null);
    });
});
server.grant(oauth2orize_1.default.grant.code(function (client, redirectURI, user, ares, done) {
    const code = (0, jwt_utils_1.generateAccessToken)(user);
    const refresh = (0, jwt_utils_1.generateRefreshToken)(user);
    const jwt = new jwt_schema_1.default({
        access: code,
        refresh: refresh,
    });
    jwt
        .save()
        .then((response) => {
        return done(null, code);
    })
        .catch((err) => {
        return done(err);
    });
}));
passport_1.default.use("client-password", new passport_oauth2_client_password_1.Strategy(function (client_id, client_secret, done) {
    user_schema_1.default.findOne({ "client.client_id": client_id })
        .populate({
        path: "chats"
    })
        .then((response) => {
        if (!response) {
            return done(null, false);
        }
        return done(null, response);
    })
        .catch((err) => {
        return done(err);
    });
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findOne({
            email: username,
        }).populate({
            path: "token",
            select: "access refresh",
        });
        if (!user) {
            return done(null, false, {
                status: 404,
                message: "User not found",
            });
        }
        const { hash } = (0, password_utils_1.hashPassword)(password, user.salt);
        if (hash !== user.hash) {
            return done(null, false, {
                status: 403,
                message: "Invalid password",
            });
        }
        return done(null, user, { scope: "*" });
    }
    catch (error) {
        return done(error);
    }
})));
server.exchange(oauth2orize_1.exchange.password(function (client, username, password, scope, done) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tokens;
            // Find user by email
            const userData = yield user_schema_1.default.findOne({
                email: username,
            }, {
                contacts: 0,
                blocked: 0,
                chats: 0,
                requests: 0,
                notifications: 0,
                archive_chats: 0
            }).populate({
                path: "token",
                select: "access refresh",
            });
            // If user not found
            if (!userData) {
                return done(null, false);
            }
            // Verify password
            function verifyPassword(password, hash, salt) {
                const { hash: hashedPassword } = (0, password_utils_1.hashPassword)(password, salt);
                return hashedPassword === hash;
            }
            const isPasswordValid = verifyPassword(password, userData.hash, userData.salt);
            // If password is not valid
            if (!isPasswordValid) {
                return done(null, false);
            }
            userData.hash = undefined;
            userData.salt = undefined;
            // variable jwt can be of type any or { _id: string, access: string, refresh: string }
            let jwt;
            // If user has token
            if ((_a = userData.token) === null || _a === void 0 ? void 0 : _a.access) {
                // Extract access and refresh token from user
                const { access, refresh } = userData.token;
                try {
                    // Verify access token
                    (0, jwt_utils_1.verifyToken)(access);
                    tokens = {
                        access_token: access,
                        refresh_token: refresh,
                    };
                    userData.token = undefined;
                    // If access token is valid
                    const responseAccess = {
                        user: userData,
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                    };
                    // Return access token
                    return done(null, "created succesfuly", responseAccess);
                }
                catch (error) {
                    if (error.name === "TokenExpiredError") {
                        // If access token is not valid
                        const accessToken = (0, jwt_utils_1.generateAccessToken)({
                            email: username,
                        });
                        const refresToken = (0, jwt_utils_1.generateRefreshToken)({
                            email: username,
                        });
                        // Save new token to database
                        jwt = yield jwt_schema_1.default.findOneAndUpdate({ access: (_b = userData.token) === null || _b === void 0 ? void 0 : _b.access }, {
                            $set: {
                                access: accessToken,
                                refresh: refresToken,
                            },
                        }, { new: true, upsert: true, runValidator: true }).exec();
                        // Update user token
                        const updateUser = yield user_schema_1.default.findOneAndUpdate({ email: username }, {
                            $set: {
                                token: jwt._id,
                            },
                        }, {
                            new: true,
                            upsert: true,
                            runValidator: true,
                            fields: {
                                hash: 0,
                                salt: 0,
                                token: 0,
                            },
                        }).exec();
                        // Return new access token
                        const responseAccess = {
                            user: updateUser,
                            access_token: accessToken,
                            refresh_token: refresToken,
                        };
                        return done(null, "created succesfuly", responseAccess);
                    }
                    // If access token is not valid
                    return done(null, error.message);
                }
            }
            // If user has no token and is valid, generate new token
            const accessToken = (0, jwt_utils_1.generateAccessToken)({ email: username });
            // Generate refresh token
            const refresToken = (0, jwt_utils_1.generateRefreshToken)({ email: username });
            // Save new token to database
            jwt = yield jwt_schema_1.default.findOneAndUpdate({ access: (_c = userData.token) === null || _c === void 0 ? void 0 : _c.access }, {
                $set: {
                    access: accessToken,
                    refresh: refresToken,
                },
            }, { new: true, upsert: true, runValidator: true }).exec();
            // Update user token
            const updateUser = yield user_schema_1.default.findOneAndUpdate({ email: username }, {
                $set: {
                    token: jwt._id,
                },
            }, {
                new: true,
                runValidator: true,
                fields: {
                    hash: 0,
                    salt: 0,
                    token: 0,
                },
            })
                .populate({
                path: "token",
                select: "access",
            })
                .exec();
            // Assign token to user
            const user = {
                user: updateUser,
                access_token: jwt.access,
                refresh_token: jwt.refresh,
            };
            // Return token
            return done(null, "created succesfuly", user);
        }
        catch (err) {
            // If error
            // Return error
            return done(err);
        }
    });
}));
server.exchange(oauth2orize_1.exchange.refreshToken(function (client, refreshToken, scope, done) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verify refresh token
            const decoded = (0, jwt_utils_1.verifyRefreshToken)(refreshToken);
            // Find user by email
            const userData = yield user_schema_1.default.findOne({
                email: (_a = decoded.payload) === null || _a === void 0 ? void 0 : _a.email
            }, {
                contacts: 0,
                blocked: 0,
                chats: 0,
                requests: 0,
                notifications: 0,
                archive_chats: 0
            })
                .select("-hash -salt")
                .populate({
                path: "token",
                select: "access refresh",
            });
            // Compare refresh token with user refresh token
            if (((_b = userData === null || userData === void 0 ? void 0 : userData.token) === null || _b === void 0 ? void 0 : _b.refresh) !== refreshToken) {
                return done(null, false, "Invalid refresh token");
            }
            // If user not found
            if (!userData) {
                return done(null, false, "User not found");
            }
            if ((_c = userData.token) === null || _c === void 0 ? void 0 : _c.access) {
                try {
                    // Verify access token
                    (0, jwt_utils_1.verifyToken)((_d = userData.token) === null || _d === void 0 ? void 0 : _d.access);
                    const tokens = {
                        access_token: (_e = userData.token) === null || _e === void 0 ? void 0 : _e.access,
                        refresh_token: (_f = userData.token) === null || _f === void 0 ? void 0 : _f.refresh,
                    };
                    userData.token = undefined;
                    // If access token is valid
                    const responseAccess = {
                        user: userData,
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                    };
                    // Return access token
                    return done(null, "response succesfuly", responseAccess);
                }
                catch (error) {
                    if (error.name === "TokenExpiredError") {
                        const accessToken = (0, jwt_utils_1.generateAccessToken)({
                            email: userData.email,
                        });
                        const refresToken = (0, jwt_utils_1.generateRefreshToken)({
                            email: userData.email,
                        });
                        // Save new token to database
                        const jwt = yield jwt_schema_1.default.findOneAndUpdate({ access: (_g = userData.token) === null || _g === void 0 ? void 0 : _g.access }, {
                            $set: {
                                access: accessToken,
                                refresh: refresToken,
                            },
                        }, { new: true, upsert: true, runValidator: true }).exec();
                        // Update user token
                        const updateUser = yield user_schema_1.default.findOneAndUpdate({ email: userData.email }, {
                            $set: {
                                token: jwt._id,
                            },
                        }, {
                            new: true,
                            upsert: true,
                            runValidator: true,
                        })
                            .select("-hash -salt -token")
                            .exec();
                        // Assign token to user
                        const user = {
                            user: updateUser,
                            access_token: jwt.access,
                            refresh_token: jwt.refresh,
                        };
                        // Return token
                        return done(null, "created succesfuly", user);
                    }
                    return done(error, "Invalid Access token");
                }
            }
        }
        catch (err) {
            // If error
            // Return error
            if (err.name === "TokenExpiredError") {
                return done(err, "Refresh Token expired");
            }
            return done(err, "Invalid Refresh Token");
        }
    });
}));
server.exchange(oauth2orize_1.exchange.clientCredentials(function (client, scope, done) {
    user_schema_1.default.findOne({ "client.client_id": client })
        .then((response) => {
        if (!response) {
            return done(null, false);
        }
        return done(null, response);
    })
        .catch((err) => {
        return done(err);
    });
}));
