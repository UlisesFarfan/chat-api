import { Router } from "express";

import {
  createUser,
  deleteUsers,
  addContactController,
  getContactByUserIdController,
  getContactByContactNameController,
  getAllKpisDataController,
} from "../controllers/user.controller";
import {
  validateToken,
  isAuthenticated
} from "../middlewares/authenticated";

const router = Router();

router.post("/", createUser);
router.get("/kpis/:id", [validateToken, isAuthenticated], getAllKpisDataController)
router.delete("/:id", [validateToken, isAuthenticated], deleteUsers);
router.post("/add", [validateToken, isAuthenticated], addContactController);
router.get("/contact/:id", [validateToken, isAuthenticated], getContactByUserIdController)
router.get("/search-contact/:id", getContactByContactNameController)

export { router };
