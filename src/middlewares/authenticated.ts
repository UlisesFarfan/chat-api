import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("mi authenticated", req.isAuthenticated());
  console.log("user", req.user);

  if (!req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
};

export { isAuthenticated };