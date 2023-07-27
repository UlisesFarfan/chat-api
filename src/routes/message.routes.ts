import { Router } from "express";
import { isAuthenticated, validateToken } from "../middlewares/authenticated";
import { newMessageController, deleteMessageByIdController } from "../controllers/message.controller";

const router = Router();

router.post("/", [validateToken, isAuthenticated], newMessageController);
router.post("/delete/:id", [validateToken, isAuthenticated], deleteMessageByIdController);

export { router };