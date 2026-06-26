import {Router} from "express";
import{validateRegisterUser , validateLoginUser}  from "../validator/auth.validator.js";
import { register } from "../controller/auth.controller.js";
import { login } from "../controller/auth.controller.js";
import {googleCallback} from "../controller/auth.controller.js";
import passport from "passport";
import {config} from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getMe } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", validateRegisterUser , register);


router.post("/login", validateLoginUser , login);

    router.get("/me" , authenticateUser , getMe  )

// /api/auth/google/
router.get("/google/", passport.authenticate("google", {scope: ["email", "profile"]}));

router.get("/google/callback",passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/" : "/login",
    }),
    googleCallback
);


export default router;

