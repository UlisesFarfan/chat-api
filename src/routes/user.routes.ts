import { Router } from "express";

import { createUser, deleteUsers, addContactController, getContactByUserIdController } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.delete("/:_id", deleteUsers);
router.post("/add", addContactController);
router.get("/contact/:id", getContactByUserIdController)

export { router };
