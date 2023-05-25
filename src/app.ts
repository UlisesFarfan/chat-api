import express from "express";

import "dotenv/config";

import morgan from "morgan";

import router from "./routes";

import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true,
  preflightContinue: false,
};

app.use(
  session({
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

// request view in development
app.use(morgan("dev"));

// middleware recived for body json
app.use(express.json());

// cors
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use(passport.session());

// index of my routes
app.use("/", router);

export default app;
