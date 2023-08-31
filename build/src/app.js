"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    credentials: true,
    preflightContinue: false,
};
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// request view in development
app.use((0, morgan_1.default)("dev"));
// middleware recived for body json
app.use(express_1.default.json());
// cors
app.use((0, cors_1.default)(corsOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// index of my routes
app.use("/", routes_1.default);
exports.default = app;
