import { Router } from "express";

import { createChat, getAllChatsController, getChatByIdController, getChatsUserByIdController, deleteChatByIdController, getChatsUserByNameController, getChatsUserByUsersNameController } from "../controllers/chat.controller";
import { validateToken, isAuthenticated } from "../middlewares/authenticated";

const router = Router();

router.post("/", createChat);
router.get("/", [validateToken, isAuthenticated], getAllChatsController);
router.get("/userid/:id", [validateToken, isAuthenticated], getChatByIdController)
router.get("/usersname/", [validateToken, isAuthenticated], getChatsUserByUsersNameController)
router.get("/user/:userId", [validateToken, isAuthenticated], getChatsUserByIdController)
router.get("/search-chat/:userId", [validateToken, isAuthenticated], getChatsUserByNameController)
router.delete("/", [validateToken, isAuthenticated], deleteChatByIdController)

export { router }