import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  var token = req.headers['authorization']
  if (!token) {
    res.status(401).send({ message: "Unauthorized" })
  } else {
    token = token.replace('Bearer ', '')
    try {
      const decode = Jwt.verify(token, process.env.SECRET_JWT!,)
      req.user = decode
      next()
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
};


const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export { validateToken, isAuthenticated };