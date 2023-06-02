import { Router } from "express";

import passport from "passport";

import { server } from "../middlewares/passport";

import { getAllUsersController, getAuthUserController, getUserByIdController, logoutUser, patchUserByIdController } from "../controllers/auth.controller";

const router = Router();

router.post("/login", [
  function (req: any, res: any, next: any) {
    passport.authenticate("local", function (err: any, user: any, info: any) {
      if (!user) {
        return res.status(info.status).json(info);
      }
      next();
    })(req, res, next);
  },
  server.token({
    userProperty: "user",
    allowExtendedTokenAttributes: true,
  }),
  server.errorHandler(),
]);
router.post("/logout", logoutUser);
router.get("/user", getAuthUserController);
router.get("/users", getAllUsersController);
router.get("/user/:id", getUserByIdController)
router.patch("/user/:id", patchUserByIdController)
router.post("/token/refresh", [server.token(), server.errorHandler()]);

export { router };
