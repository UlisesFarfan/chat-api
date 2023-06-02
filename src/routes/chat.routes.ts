import { Router } from "express";

import { createChat, getAllChatsController, getChatByIdController, getChatsUserByIdController, deleteChatByIdController } from "../controllers/chat.controller";
import { validateToken, isAuthenticated } from "../middlewares/authenticated";

const router = Router();

router.post("/", [validateToken, isAuthenticated], createChat);
router.get("/", [validateToken, isAuthenticated], getAllChatsController);
router.get("/:id", [validateToken, isAuthenticated], getChatByIdController)
router.get("/user/:userId", [validateToken, isAuthenticated], getChatsUserByIdController)
router.delete("/", deleteChatByIdController)

export { router }