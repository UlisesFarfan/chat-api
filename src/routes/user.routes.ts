import { Router } from "express";

import { createUser, deleteUsers } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.delete("/:_id", deleteUsers);
router.post("/add/controllerAddContact")

export { router };
