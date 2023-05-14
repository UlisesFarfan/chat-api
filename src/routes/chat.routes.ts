import { Router } from "express";

import { createChat, getAllChatsController, getChatByIdController, getChatsUserByIdController } from "../controllers/chat.controller";

const router = Router();

router.post("/", createChat);
router.get("/", getAllChatsController);
router.get("/:id", getChatByIdController)
router.get("/user/:userId", getChatsUserByIdController)

export { router }