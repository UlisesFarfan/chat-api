"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../middlewares/passport");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/login", [
    function (req, res, next) {
        passport_1.default.authenticate("local", function (err, user, info) {
            if (!user) {
                return res.status(info.status).json(info);
            }
            next();
        })(req, res, next);
    },
    passport_2.server.token({
        userProperty: "user",
        allowExtendedTokenAttributes: true,
    }),
    passport_2.server.errorHandler(),
]);
router.post("/logout", auth_controller_1.logoutUser);
router.get("/user", auth_controller_1.getAuthUserController);
router.get("/users", auth_controller_1.getAllUsersController);
router.get("/user/:id", auth_controller_1.getUserByIdController);
router.patch("/user/:id", auth_controller_1.patchUserByIdController);
router.post("/token/refresh", [passport_2.server.token(), passport_2.server.errorHandler()]);
