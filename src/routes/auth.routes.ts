import { Router } from "express";

import passport from "passport";

import { server } from "../middlewares/passport";

import { getAllUsers, getAuthUser, getUserById, logoutUser, patchUserById } from "../controllers/auth.controller";

const router = Router();

router.post("/login", [
  function (req:any, res:any, next:any) {
    passport.authenticate("local", function (err:any, user:any, info:any) {
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
router.get("/user", getAuthUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById)
router.patch("/user/:id", patchUserById)
router.post("/token/refresh", [server.token(), server.errorHandler()]);

export { router };
