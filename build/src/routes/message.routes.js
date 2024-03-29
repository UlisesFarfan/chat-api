"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authenticated_1 = require("../middlewares/authenticated");
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/", [authenticated_1.validateToken, authenticated_1.isAuthenticated], message_controller_1.newMessageController);
router.post("/delete/:id", [authenticated_1.validateToken, authenticated_1.isAuthenticated], message_controller_1.deleteMessageByIdController);
