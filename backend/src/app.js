import express from "express";
import cookierParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";

import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20"
import { config } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cookierParser());

// using proxy
// app.use(    cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"]

// }));    
app.use("/api/v1/auth", authRouter);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("server is running"));
app.use("/api/auth" , authRouter);


app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
   
    async (accessToken, refreshToken, profile, done) => {
       return done(null, profile);
    }

  )
);

export default app;