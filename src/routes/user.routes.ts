import { Router } from "express";

import {
  createUser,
  deleteUserController,
  addContactController,
  getContactByUserIdController,
  getContactByContactNameController,
  getContactBlockedController,
  upDateInfoController,
  putBlockUserController,
  deleteContactController,
  deleteAccountUserController
} from "../controllers/user.controller";
import {
  validateToken,
  isAuthenticated
} from "../middlewares/authenticated";

const router = Router();

router.post("/", createUser);
router.get("/block-users/:id", [validateToken, isAuthenticated], getContactBlockedController);
router.put("/block-user/", [validateToken, isAuthenticated], putBlockUserController);
router.delete("/delete-user/:id", [validateToken, isAuthenticated], deleteUserController);
router.delete("/delete-contact", [validateToken, isAuthenticated], deleteContactController);
router.delete("/:id", [validateToken, isAuthenticated], deleteAccountUserController);
router.post("/add", [validateToken, isAuthenticated], addContactController);
router.get("/contact/:id", [validateToken, isAuthenticated], getContactByUserIdController);
router.get("/search-contact/:id", [validateToken, isAuthenticated], getContactByContactNameController);
router.post("/update-info/", [validateToken, isAuthenticated], upDateInfoController);


export { router };
