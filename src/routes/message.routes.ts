import { Router } from "express";

import { newMessageController } from "../controllers/message.controller";

const router = Router();

router.post("/", newMessageController);

export { router };